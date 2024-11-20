from django.core.files.storage import FileSystemStorage
from pydub import AudioSegment
from pyannote.audio import Pipeline
import requests
import speech_recognition as sr
import pandas as pd
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User

load_dotenv()
TOKEN = os.getenv('AUTH_TOKEN')
BERT_TOKEN = os.getenv('BERT_TOKEN')

# Convert MP3 to WAV
def convert_mp3_to_wav(mp3_file, wav_file):
    sound = AudioSegment.from_mp3(mp3_file)
    sound.export(wav_file, format="wav")

# Parse RTTM file
def parse_rttm(rttm_file):
    cols = ['Type', 'File ID', 'Channel ID', 'Turn Onset', 'Turn Duration',
            'Orthography Field', 'Speaker Type', 'Speaker Name', 'Confidence Score', 'Signal Lookahead Time']
    df = pd.read_csv(rttm_file, delim_whitespace=True, names=cols)
    return df

# Extract audio segments
def extract_audio_segments(audio_file, segments):
    audio = AudioSegment.from_wav(audio_file)
    segment_files = []
    for idx, row in segments.iterrows():
        start_ms = int(row['Turn Onset'] * 1000)
        duration_ms = int(row['Turn Duration'] * 1000)
        segment_audio = audio[start_ms:start_ms + duration_ms]
        segment_file = f"segment_{idx}.wav"
        segment_audio.export(segment_file, format="wav")
        segment_files.append((segment_file, row['Speaker Name']))
    return segment_files

# Transcribe audio segments
def transcribe_segments(segment_files):
    recognizer = sr.Recognizer()
    transcriptions = []
    for segment_file, speaker in segment_files:
        with sr.AudioFile(segment_file) as source:
            audio_data = recognizer.record(source)
        text=""
        try:
            text = recognizer.recognize_google(audio_data)
            transcriptions.append({'Speaker': speaker, 'Transcription': text})
        except:
            continue
    return transcriptions

def calculate_engagement_score(transcriptions, segments):
    # Calculate engagement metrics based on the transcriptions and segments
    speaking_pace = sum(segments['Turn Duration']) / sum([len(item['Transcription'].split()) for item in transcriptions])
    turn_taking_balance = calculate_turn_taking_balance(segments)
    interaction_rate = calculate_interaction_rate(segments)

    # Combine the metrics to calculate the overall engagement score
    engagement_score = (speaking_pace * turn_taking_balance * interaction_rate) ** (1/3)
    return round(engagement_score, 1)

def calculate_turn_taking_balance(segments):
    # Calculate the turn-taking balance based on the duration of each speaker's segments
    speaker_durations = {}
    for _, row in segments.iterrows():
        speaker = row['Speaker Name']
        duration = row['Turn Duration']
        if speaker not in speaker_durations:
            speaker_durations[speaker] = 0
        speaker_durations[speaker] += duration

    total_duration = sum(speaker_durations.values())
    balance = 1 - sum([abs(duration - total_duration / len(speaker_durations)) for duration in speaker_durations.values()]) / (2 * total_duration)
    return round(balance * 100, 0)

def calculate_interaction_rate(segments):
    # Calculate the interaction rate based on the number of segments
    num_segments = len(segments)
    if num_segments > 0:
        start_time = segments['Turn Onset'].min()
        end_time = segments['Turn Onset'].max() + segments['Turn Duration'].max()
        interaction_rate = num_segments / (end_time - start_time)
    else:
        interaction_rate = 0
    return round(interaction_rate * 100, 0)

# Django view to handle the file upload and processing
@csrf_exempt
@api_view(['POST'])
def upload_file(request):
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        
        # Save the uploaded MP3 file
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)
        
        # Convert MP3 to WAV
        wav_file = file_path.replace('.mp3', '.wav')
        convert_mp3_to_wav(file_path, wav_file)

        # Load the speaker diarization pipeline
        pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization",
                                            use_auth_token=TOKEN)
        
        # Perform speaker diarization
        diarization = pipeline(wav_file)
        rttm_file = wav_file.replace('.wav', '.rttm')
        with open(rttm_file, "w") as rttm:
            diarization.write_rttm(rttm)
        # Parse the RTTM file and extract segments
        segments = parse_rttm(rttm_file)
        segment_files = extract_audio_segments(wav_file, segments)

        # Transcribe the audio segments
        transcriptions = transcribe_segments(segment_files)

        # Group transcriptions by speaker
        speaker_transcriptions = {}
        for item in transcriptions:
            speaker = item['Speaker']
            transcription = item['Transcription']
            if speaker not in speaker_transcriptions:
                speaker_transcriptions[speaker] = []
            speaker_transcriptions[speaker].append(transcription)

        # Summarize the entire meeting transcript
        
        full_transcript = ' '.join([item['Transcription'] for item in transcriptions])
        # summarizer = hf_pipeline("summarization", model="facebook/bart-large-cnn")
        # meeting_summary = summarizer(full_transcript, max_length=150, min_length=60, do_sample=False)[0]['summary_text']
        
        API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
        headers = {"Authorization": BERT_TOKEN}

        def query(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            return response.json()
            
        output = query({
            "inputs": full_transcript,
        })
        meeting_summary=output[0]["summary_text"]

        # Summarize individual speaker contributions
        speaker_summaries = {}
        for speaker, transcripts in speaker_transcriptions.items():
            speaker_text = ' '.join(transcripts)
            output = query({
            "inputs": speaker_text,
            })
            summary=output[0]["summary_text"]
            speaker_summaries[speaker] = summary

        # Calculate meeting analytics
        audio = AudioSegment.from_file(file_path)
        total_duration = len(audio) / (1000*60)
        num_participants = len(speaker_transcriptions)
        total_segments = len(transcriptions)
        engagement_score = calculate_engagement_score(transcriptions, segments)

        # Prepare the response data
        response_data = {
            'total_duration': total_duration,
            'num_participants': num_participants,
            'total_segments': total_segments,
            'engagement_score': engagement_score,
            'meeting_summary': meeting_summary,
            'speaker_summaries': speaker_summaries,
            'transcriptions': transcriptions
        }

        # Clean up temporary files
        for segment_file, _ in segment_files:
            os.remove(segment_file)
        os.remove(wav_file)
        
        return JsonResponse(response_data)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        })
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Delete the token to logout
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    return Response({
        'id': request.user.id,
        'email': request.user.email,
        'username': request.user.username
    })