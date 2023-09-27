import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FormCheck from "react-bootstrap/FormCheck";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate  } from 'react-router-dom';
const Problem2 = () => {
    const navigateTo = useNavigate()
  const [modalAVisible, setModalAVisible] = useState(false);
  const [modalBVisible, setModalBVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [onlyEven, setOnlyEven] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]
  );
  useEffect(() => {
    const filtered= 
    onlyEven ? contacts?.filter((contact) => contact.id % 2 === 0) : contacts
    setFilteredContacts(filtered)
  }, [onlyEven]);

  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  //   console.log(contacts);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
    // Use a debounced search input to introduce a small delay
    const delay = 300; // milliseconds
    const timeoutId = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    fetch("https://contact.mediusware.com/api/contacts/")
      .then((response) => response.json())
      .then((data) => {
        setContacts(data.results);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const fetchContacts = async (country = "", search = "") => {
    const baseUrl = "https://contact.mediusware.com/api";
    const endpoint = country ? `/country-contacts/${country}/` : "/contacts/";
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    const url = `${baseUrl}${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.results;
      } else {
        throw new Error("Failed to fetch contacts.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = async () => {
    const country = modalBVisible ? "United States" : "";
    const contacts = await fetchContacts(country, searchInput);
    setFilteredContacts(contacts);
  };

  const openModalA = () => {
    setModalAVisible(true);
    setModalBVisible(false);
    handleSearch();
    navigateTo('/modal-a',{ replace: true })
  };

  const openModalB = () => {
    setModalBVisible(true);
    setModalAVisible(false);
    handleSearch();
    navigateTo('/modal-b',{ replace: true });
  };

  const closeModal = () => {
    setModalAVisible(false);
    setModalBVisible(false);
    
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactDetailsModal = () => {
    setSelectedContact(null);
  };

  useEffect(() => {
    // You can also trigger search when the searchInput state changes
    handleSearch();
  }, [searchInput]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-primary" onClick={openModalA} size="lg">
            All Contacts
          </Button>
          <Button variant="outline-warning" onClick={openModalB} size="lg">
            US Contacts
          </Button>
        </div>
      </div>

      {/* Modal A */}
      <Modal show={modalAVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal A</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
          {filteredContacts?.map((contact) => (
            <div
              key={contact?.id}
              className="contact-item m-1"
              onClick={() => handleContactClick(contact)}
            >
              {contact?.phone}
            </div>
          ))}
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={openModalA}
          >
            All Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#ff7f50", color: "white" }}
            onClick={openModalB}
          >
            US Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            type="checkbox"
            label="Only even"
            id="onlyEvenCheckbox"
            checked={onlyEven}
            onChange={() => setOnlyEven(!onlyEven)}
          />
        </Modal.Footer>
      </Modal>

      {/* Modal B */}
      <Modal show={modalBVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal B</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
          />
          {filteredContacts
            ?.filter((contact) => contact?.country?.name === "United States")
            .map((contact) => (
              <div
                key={contact?.id}
                className="contact-item m-1"
                onClick={() => handleContactClick(contact)}
              >
                {contact?.phone}
              </div>
            ))}
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={openModalA}
          >
            All Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#ff7f50", color: "white" }}
            onClick={openModalB}
          >
            US Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            type="checkbox"
            label="Only even"
            id="onlyEvenCheckbox"
            checked={onlyEven}
            onChange={() => setOnlyEven(!onlyEven)}
          />
        </Modal.Footer>
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        show={!!selectedContact}
        onHide={closeContactDetailsModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ID: {selectedContact?.id}</p>
          <p>Phone: {selectedContact?.phone}</p>
          <p>Country: {selectedContact?.country?.name}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Problem2;
