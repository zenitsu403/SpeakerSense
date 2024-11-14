from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from pydub import AudioSegment
from pyannote.audio import Pipeline
import speech_recognition as sr
import pandas as pd
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from transformers import pipeline as hf_pipeline
from django.shortcuts import render
from rest_framework.decorators import api_view

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
        try:
            text = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            text = "[Unintelligible]"
        except sr.RequestError as e:
            text = f"[Error: {e}]"
        transcriptions.append({'Speaker': speaker, 'Transcription': text})
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
                                            use_auth_token="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")
        
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
        summarizer = hf_pipeline("summarization", model="facebook/bart-large-cnn")
        full_transcript = ' '.join([item['Transcription'] for item in transcriptions])
        meeting_summary = summarizer(full_transcript, max_length=150, min_length=60, do_sample=False)[0]['summary_text']

        # Summarize individual speaker contributions
        speaker_summaries = {}
        for speaker, transcripts in speaker_transcriptions.items():
            speaker_text = ' '.join(transcripts)
            summary = summarizer(speaker_text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
            speaker_summaries[speaker] = summary

        # Calculate meeting analytics
        total_duration = sum(segments['Turn Duration'])
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

        print(response_data)

        # Clean up temporary files
        for segment_file, _ in segment_files:
            os.remove(segment_file)
        os.remove(wav_file)
        
        return JsonResponse(response_data)