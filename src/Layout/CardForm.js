import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, createCard, updateCard } from "../utils/api";



function CardForm({ formInput }) {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});
  const history = useHistory();
  const initialFormState = {
    front: "",
    back: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  
  useEffect(() => {
    if (formInput) {
      console.log(formInput);
      setFormData({
        id: formInput.id,
        deckId: formInput.deckId,
        front: formInput.front,
        back: formInput.back,
      })
    }
  }, [])

  // sets state of deck to be the desired deck whenever the deckId changes
  useEffect(() => {
    const abortController = new AbortController();
    async function displayDeck() {
      try {
        const response = await readDeck(deckId, abortController.signal);
        setDeck(response);
      } catch (error) {
        console.log(error);
      }
    }
    displayDeck();
    return () => abortController.abort();
  }, [deckId]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ac = new AbortController();
    if (!formInput) {
      createCard(deckId, formData, ac.signal);
    } else {
      console.log("form Data",formData);
      updateCard(formData, ac.signal);
    }
    history.push(`/decks/${deck.id}`);
    window.location.reload();
      
  };
    return (
    <form onSubmit={handleSubmit}>
       <input type="hidden" id="deckId" name="deckId" value={formData.deckId}></input>
        <input type="hidden" id="id" name="id" value={formData.id}></input>
        <div className="form-group">
          <label>Front</label>
          <textarea
            type="text"
            className="form-control"
            id="front"
            name="front"
            placeholder="Front Side of Card"
            onChange={handleChange}
            value={formData.front}
          />
        </div>
        <div className="form-group">
          <label>Back</label>
          <textarea
            type="text"
            className="form-control"
            id="back"
            placeholder="Back Side of Card"
            name="back"
            onChange={handleChange}
            value={formData.back}
          />
        </div>
        <Link to={`/decks/${deckId}`}>
          <button className="btn btn-secondary mr-2">
            <i class="bi bi-x-circle-fill"> </i>
            Cancel
          </button>
        </Link>
        <button className="btn btn-primary">
          <i class="bi bi-stars"> </i>
          Save
        </button>
    </form>
    )
}

export default CardForm;