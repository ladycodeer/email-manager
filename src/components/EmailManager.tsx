import React, { useState, useEffect } from "react";
import { Collapse } from "@mui/material";

type Recipient = {
  email: string;
  domain: string;
};

// Modal component for notifications
const NotificationModal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="absolute bottom-0 left-0 m-4 rounded-md  bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{message}</p>
      </div>
    </div>
  );
};

const EmailManager = () => {
  // State for managing available and selected recipients
  const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([
    { email: "mehmet@posteffect.ai", domain: "posteffect.ai" },
    { email: "mert@posteffect.ai", domain: "posteffect.ai" },
    { email: "natalia@posteffect.ai", domain: "posteffect.ai" },
    { email: "hilal@posteffect.ai", domain: "posteffect.ai" },
    { email: "rabia@posteffect.ai", domain: "posteffect.ai" },
    { email: "muhammed@gmail.com", domain: "gmail.com" },
    { email: "ugur@gmail.com", domain: "gmail.com" },
    { email: "furkan@gmail.com", domain: "gmail.com" },
    { email: "batin@gmail.com", domain: "gmail.com" },
    { email: "ibrahim@gmail.com", domain: "gmail.com" },
  ]);

  const [selectedCompanyRecipients, setSelectedCompanyRecipients] = useState<
    string[]
  >([]);
  const [selectedEmailRecipients, setSelectedEmailRecipients] = useState<
    Recipient[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompanyRecipients, setShowCompanyRecipients] = useState(true);
  const [showEmailRecipients, setShowEmailRecipients] = useState(true);
  const [notification, setNotification] = useState<string>("");

  // Filter available recipients by search term
  const filteredRecipients = availableRecipients.filter(
    (recipient) =>
      recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Email validation function
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Add recipient based on domain or email
  const handleAddRecipient = (recipient: Recipient) => {
    const isDomainSelected = selectedCompanyRecipients.includes(
      recipient.domain
    );
    const isRecipientSelected = selectedEmailRecipients.some(
      (r) => r.email === recipient.email
    );

    if (isRecipientSelected) {
      setNotification("This email is already selected.");
    } else if (!isDomainSelected) {
      const domainRecipients = availableRecipients.filter(
        (r) => r.domain === recipient.domain
      );
      setSelectedEmailRecipients((prev) => [...prev, ...domainRecipients]);
      setSelectedCompanyRecipients((prev) => [...prev, recipient.domain]);
      setNotification("Email added to the selected recipients.");
    } else {
      setSelectedEmailRecipients((prev) => [...prev, recipient]);
      setNotification("Email added to the selected recipients.");
    }
  };

  // Add a new recipient to the available recipients list
  const handleAddNewRecipient = (email: string) => {
    if (!isValidEmail(email)) {
      setNotification("Invalid email address.");
      return;
    }
    const domain = email.split("@")[1];
    const newRecipient = { email, domain };
    setAvailableRecipients((prev) => [...prev, newRecipient]);
    handleAddRecipient(newRecipient);
  };

  // Remove an individual recipient
  const removeRecipient = (email: string) => {
    const recipientToRemove = selectedEmailRecipients.find(
      (r) => r.email === email
    );
    if (recipientToRemove) {
      setSelectedEmailRecipients((prev) =>
        prev.filter((r) => r.email !== email)
      );

      const remainingRecipients = selectedEmailRecipients.filter(
        (r) => r.domain === recipientToRemove.domain && r.email !== email
      );
      if (remainingRecipients.length === 0) {
        setSelectedCompanyRecipients((prev) =>
          prev.filter((domain) => domain !== recipientToRemove.domain)
        );
      }
    }
  };

  // Remove all recipients under a domain
  const removeDomain = (domain: string) => {
    setSelectedEmailRecipients((prev) =>
      prev.filter((r) => r.domain !== domain)
    );
    setSelectedCompanyRecipients((prev) => prev.filter((d) => d !== domain));
  };

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle key down in search input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddNewRecipient(searchTerm);
    }
  };

  // Toggle showing company recipients
  const toggleCompanyRecipients = () => {
    setShowCompanyRecipients(!showCompanyRecipients);
  };

  // Toggle showing email recipients
  const toggleEmailRecipients = () => {
    setShowEmailRecipients(!showEmailRecipients);
  };

  // Close notification
  const closeNotification = () => {
    setNotification("");
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Available Recipients */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">
          Available Recipients
        </h2>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search or add email"
          className="border border-gray-300 p-2 rounded-md w-full mb-4"
        />
        <ul className="list-none">
          {filteredRecipients.map((recipient) => (
            <li
              key={recipient.email}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
              onClick={() => handleAddRecipient(recipient)}
            >
              {recipient.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Recipients */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">
          Selected Recipients
        </h2>

        {/* Company Recipients */}
        <div className="mb-4">
          <button
            className="text-lg font-semibold border-gray-400 text-blue-500 flex items-center mb-2"
            onClick={toggleCompanyRecipients}
          >
            Company Recipients
            <svg
              className={`w-4 h-4 ml-2 transform ${
                showCompanyRecipients ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Collapse in={showCompanyRecipients}>
            <ul className="list-none">
              {selectedCompanyRecipients.map((domain) => (
                <li key={domain} className="p-2 flex justify-between">
                  {domain} (all recipients)
                  <button
                    onClick={() => removeDomain(domain)}
                    className="text-red-500"
                  >
                    Remove All
                  </button>
                </li>
              ))}
            </ul>
          </Collapse>
        </div>

        {/* Email Recipients */}
        <div>
          <button
            className="text-lg font-semibold text-blue-500 flex items-center mb-2"
            onClick={toggleEmailRecipients}
          >
            Email Recipients
            <svg
              className={`w-4 h-4 ml-2 transform ${
                showEmailRecipients ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Collapse in={showEmailRecipients}>
            <ul className="list-none">
              {selectedEmailRecipients.map((recipient) => (
                <li key={recipient.email} className="p-2 flex justify-between">
                  {recipient.email}
                  <button
                    onClick={() => removeRecipient(recipient.email)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </Collapse>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal message={notification} onClose={closeNotification} />
    </div>
  );
};

export default EmailManager;
