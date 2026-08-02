import "./ReportProblemButton.css";

export default function ReportProblemButton() {
  const openReport = () => {
    const report = new URL("https://one.3stoneai.com/report-problem");
    report.searchParams.set("source", window.location.href);
    report.searchParams.set("product", "3Stone Picks");
    window.location.assign(report.toString());
  };

  return (
    <button type="button" className="report-problem-button" onClick={openReport} aria-label="Report a problem">
      <span aria-hidden="true">⚑</span> Report a problem
    </button>
  );
}
