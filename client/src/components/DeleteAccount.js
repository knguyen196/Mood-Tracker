import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DeleteAccount = () => {
  const { deleteAccount } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    setError("");
    try {
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      setError("Failed to delete account");
    }
  };

  return (
    <div className="delete-account">
      {error && <p className="error">{error}</p>}

      {!confirming ? (
        <button className="danger-btn" onClick={() => setConfirming(true)}>
          Delete account
        </button>
      ) : (
        <div className="confirm-row">
          <span>Are you sure?</span>
          <button className="danger-btn" onClick={handleDelete}>
            Yes
          </button>
          <button onClick={() => setConfirming(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
