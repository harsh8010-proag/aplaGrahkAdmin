import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportUserReport = (user, applications = [], payments = []) => {
  const doc = new jsPDF();

  // Heading
  doc.setFontSize(18);
  doc.text("User Report", 14, 20);

  // ---------------- Personal Info ----------------
  doc.setFontSize(14);
  doc.text("Personal Information", 14, 35);

  autoTable(doc, {
    startY: 40,
    head: [["Field", "Value"]],
    body: [
      ["Name", user?.name || "N/A"],
      ["Mobile", user?.mobileNumber || "N/A"],
      // ["Email", user?.email || "N/A"],
      ["Address", user?.address || "N/A"],
      ["Taluka", user?.taluka || "N/A"],
      ["District", user?.district || "N/A"],
      // ["Pincode", user?.pincode || "N/A"],
      ["Status", user?.isBlock ? "Blocked" : "Active"],
      // ["Joined", formatDate(user?.createdAt)],
    ],
  });

  // ---------------- Applications ----------------
  doc.text("Applications", 14, doc.lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["ID", "Service", "Submitted", "Payment", "Status"]],
    body: applications.map((app) => [
      app.id || app._id || "N/A",
      app.service || "N/A",
      app.submitted || "N/A",
      app.payment || "N/A",
      app.status || "N/A",
    ]),
  });

  // ---------------- Payments ----------------
  doc.text("Payments", 14, doc.lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Transaction", "Service", "Method", "Status", "Date", "Amount"]],
    body: payments.map((payment) => [
      payment.id || payment.transactionId || "N/A",
      payment.service || "N/A",
      payment.method || "N/A",
      payment.payment || "N/A",
      payment.date || "N/A",
      payment.amount || "N/A",
    ]),
  });

  doc.save(`${user?.name || "User"}_Report.pdf`);
};
