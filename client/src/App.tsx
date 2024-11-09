import Polls from "./components/polls";
import SiteHeader from "./components/site-header";

export default function App() {
  return (
    <section>
      <SiteHeader />
      <main className="container mx-auto">
        <Polls />
      </main>
    </section>
  );
}
