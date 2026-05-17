import React, { useEffect, useState } from "react";

const tickets = () => {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);
  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.ID}>
          <p>{ticket.title}</p>
          <p>{ticket.description}</p>
          <p>{ticket.status}</p>
        </div>
      ))}
    </div>
  );
};

export default tickets;
