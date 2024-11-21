const Footer = () => {
    return (
      <footer className="mt-auto py-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Made with <span className="text-red-400">♥️</span>
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              key="Mukund Acharya"
              href="https://www.linkedin.com/in/mukund-acharya-a8b12b256"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Mukund Acharya
            </a>
            <a
              key="Alok Shukla"
              href="https://www.linkedin.com/in/alok-shukla-059ab8253/"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Alok Shukla
            </a>
            <a
              key="Kartikey Ameta"
              href="https://www.linkedin.com/in/kartikey-ameta-5a5445252/"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Kartikey Ameta
            </a>
          </div>
        </div>
      </footer>
    );
  };

export default Footer;