import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Consimtamant.css";

// ADD: Mock consents data
const MOCK_CONSENTS = [
  {
    id: 1,
    numePrenume: "Popescu Ion",
    dataAcord: "2024-10-01T10:30:00",
    ipDispozitiv: "192.168.1.100",
    gdpr: { version: "1.0" }
  },
  {
    id: 2,
    numePrenume: "Ionescu Maria",
    dataAcord: "2024-09-28T14:20:00",
    ipDispozitiv: "192.168.1.101",
    gdpr: { version: "1.0" }
  },
  {
    id: 3,
    numePrenume: "Georgescu Andrei",
    dataAcord: "2024-09-25T09:15:00",
    ipDispozitiv: "192.168.1.102",
    gdpr: { version: "1.0" }
  },
  {
    id: 4,
    numePrenume: "Popa Elena",
    dataAcord: "2024-09-20T16:45:00",
    ipDispozitiv: "192.168.1.103",
    gdpr: { version: "1.0" }
  },
  {
    id: 5,
    numePrenume: "Dumitrescu Alex",
    dataAcord: "2024-09-18T11:00:00",
    ipDispozitiv: "192.168.1.104",
    gdpr: { version: "1.1" }
  },
  {
    id: 6,
    numePrenume: "Stan Cristina",
    dataAcord: "2024-08-15T13:30:00",
    ipDispozitiv: "192.168.1.105",
    gdpr: { version: "1.0" }
  }
];

const ConsimtamantTable = () => {
  const [consents, setConsents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // REPLACED: Fetch with mock data loading
  useEffect(() => {
    const fetchConsents = () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        setConsents(MOCK_CONSENTS);
        setIsLoading(false);
      }, 500);
    };

    fetchConsents();
  }, []);

  return (
    <div className="consimtamant-container">
      <div className="consimtamant-header">
        <h1>Consimțământ GDPR (Demo)</h1>

        <Link to="/admin/gdpr" className="btn btn-primary">
          📜 Gestionare GDPR
        </Link>
      </div>

      {isLoading ? (
        <p>Se încarcă...</p>
      ) : consents.length === 0 ? (
        <p>Nu există consimțăminte înregistrate.</p>
      ) : (
        <table className="consimtamant-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume Prenume</th>
              <th>Data Acord</th>
              <th>IP Dispozitiv</th>
              <th>GDPR Version</th>
            </tr>
          </thead>
          <tbody>
            {consents.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.numePrenume}</td>
                <td>
                  {c.dataAcord
                    ? new Date(c.dataAcord).toLocaleString("ro-RO")
                    : "-"}
                </td>
                <td>{c.ipDispozitiv}</td>
                <td>{c.gdpr ? c.gdpr.version : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConsimtamantTable;