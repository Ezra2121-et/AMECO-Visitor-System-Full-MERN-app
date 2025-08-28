// src/pages/SystemAdmin/Reports.jsx
import ReceptionistReports from "../receptionist/Reports";

export default function Reports() {
  const printPdf = () => window.print();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">System Admin Reports</h1>
        <button onClick={printPdf} className="px-3 py-2 border rounded">Print / Save as PDF</button>
      </div>
      <ReceptionistReports />
    </div>
  );
}
