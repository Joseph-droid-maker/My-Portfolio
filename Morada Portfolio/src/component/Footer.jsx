import './css/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <span>Morada · CS Student · Arellano University · Manila</span>
      <span>Built with React + Vite · {new Date().getFullYear()}</span>
    </footer>
  );
}