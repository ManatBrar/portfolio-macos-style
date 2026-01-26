import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import ContactMeWrapper from "./components/windows/ContactMe";
import SkillsWrapper from "./components/windows/Skills";
import { WindowProvider } from "./context/WindowContext";

const App = () => {
  return (
    <main>
      <WindowProvider>
        <Navbar />
        <Dock />
        <ContactMeWrapper />
        <SkillsWrapper />
      </WindowProvider>
    </main>
  );
};

export default App;
