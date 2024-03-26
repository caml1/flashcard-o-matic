import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateCard, readCard } from "../utils/api";
import CardForm from "./CardForm";

function EditCard() {
  const { deckId, cardId } = useParams();
  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);
  const [formData, setFormData] = useState(null);
  const history = useHistory();

  // sets state of deck to be the desired deck whenever the deckId changes, does the same for card
  useEffect(() => {
    const abortController = new AbortController();
    async function displayDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        const cardResponse = await readCard(cardId, abortController.signal);
        setDeck(response);
        setCard(cardResponse);
        setFormData(cardResponse);
      } catch (error) {
        console.log(error);
      }
    }
    displayDeck();
    return () => abortController.abort();
  }, [deckId, cardId]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ac = new AbortController();
    updateCard(formData, ac.signal);
    history.push(`/decks/${deck.id}`);
    window.location.reload();
  };

  if (!formData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>
                {deck ? deck.name : "Loading..."}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {`Edit Card ${card.id}`}
            </li>
          </ol>
        </nav>
      </div>

      <h1>Edit Card</h1>

      <CardForm formInput={card}/>
    </div>
  );
}

export default EditCard;
