const Footer = () => {
    return (
      <footer className="mt-auto py-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Made with <span className="text-red-400">♥️</span> for <span className="font-medium text-blue-400">ISDL</span>
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            {["Alok", "Kartikey", "Mukund", "Priyanshu", "Adarsh"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  };

export default Footer;