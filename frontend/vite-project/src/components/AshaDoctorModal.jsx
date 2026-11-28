import { useState, useEffect, useRef } from "react";
import {
  createAshaContactId,
  isValidIndianPhone,
  sanitizeIndianPhone
} from "../utils/ashaStorage";

function AshaDoctorModalDialog({
  editingContact,
  existingContacts,
  copy,
  onClose,
  onSave,
  onToast
}) {
  const takenRoles = existingContacts
    .filter((c) => !editingContact || c.id !== editingContact.id)
    .map((c) => c.role);

  const initialRole = editingContact
    ? editingContact.role
    : takenRoles.includes("asha")
    ? "doctor"
    : "asha";

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState(editingContact?.name || "");
  const [phone, setPhone] = useState(editingContact?.phone || "");
  const [location, setLocation] = useState(editingContact?.location || "");
  const [isPrimary, setIsPrimary] = useState(
    editingContact ? Boolean(editingContact.isPrimary) : existingContacts.length === 0
  );
  const [errorMsg, setErrorMsg] = useState("");
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Body scroll lock, initial focus, & Escape key handling
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 30);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const sanitizedPhone = sanitizeIndianPhone(phone);

    if (!trimmedName) {
      const msg = copy.ashaErrName || "Please enter a name (e.g. Sunita Devi).";
      setErrorMsg(msg);
      onToast(msg);
      if (nameInputRef.current) nameInputRef.current.focus();
      return;
    }

    if (!isValidIndianPhone(sanitizedPhone)) {
      const msg =
        copy.ashaErrPhone ||
        "Enter a valid 10-digit Indian mobile number or +91 format.";
      setErrorMsg(msg);
      onToast(msg);
      if (phoneInputRef.current) phoneInputRef.current.focus();
      return;
    }

    if (takenRoles.includes(role)) {
      const msg =
        copy.ashaErrRoleExists ||
        "A contact for this role is already saved. Edit it or choose the other role.";
      setErrorMsg(msg);
      onToast(msg);
      return;
    }

    onSave({
      id: editingContact ? editingContact.id : createAshaContactId(role),
      name: trimmedName,
      role,
      phone: sanitizedPhone,
      location: location.trim(),
      isPrimary: existingContacts.length === 0 ? true : isPrimary
    });
  };

  return (
    <div
      className="asha-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="asha-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ashaModalTitle"
      >
        <div className="asha-modal-header">
          <h3 id="ashaModalTitle">
            {editingContact
              ? copy.ashaModalEditTitle || "Edit ASHA / Doctor"
              : copy.ashaModalAddTitle || "Save ASHA / Doctor"}
          </h3>
          <button
            type="button"
            className="asha-modal-close"
            onClick={onClose}
            aria-label={copy.ashaCloseLabel || "Close dialog"}
          >
            ✕
          </button>
        </div>

        <form className="asha-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="asha-field">
            <span className="asha-label">{copy.ashaFieldRole || "Role"}</span>
            <div
              className="asha-role-toggle"
              role="radiogroup"
              aria-label={copy.ashaFieldRole || "Role"}
            >
              {["asha", "doctor"].map((r) => {
                const isTaken = takenRoles.includes(r);
                const label =
                  r === "doctor"
                    ? copy.ashaRoleDoctor || "Doctor"
                    : copy.ashaRoleAsha || "ASHA";
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={role === r}
                    disabled={isTaken}
                    className={`asha-role-opt ${role === r ? "active" : ""}`}
                    onClick={() => {
                      setRole(r);
                      setErrorMsg("");
                    }}
                  >
                    <span>
                      {r === "doctor" ? "👨‍⚕️" : "🩺"} {label}
                    </span>
                    {isTaken && (
                      <small className="asha-role-taken">
                        ({copy.ashaRoleTakenNote || "Already saved"})
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="asha-field">
            <label className="asha-label" htmlFor="ashaNameInput">
              {copy.ashaFieldName || "Name"} *
            </label>
            <input
              ref={nameInputRef}
              id="ashaNameInput"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder={
                copy.ashaFieldNamePlaceholder ||
                "e.g. Sunita Devi or Dr. Ramesh Sharma"
              }
              required
            />
          </div>

          <div className="asha-field">
            <label className="asha-label" htmlFor="ashaPhoneInput">
              {copy.ashaFieldPhone || "Phone Number"} *
            </label>
            <input
              ref={phoneInputRef}
              id="ashaPhoneInput"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder={
                copy.ashaFieldPhonePlaceholder ||
                "e.g. 98765 43210 or +91 98765 43210"
              }
              required
            />
          </div>

          <div className="asha-field">
            <label className="asha-label" htmlFor="ashaLocationInput">
              {copy.ashaFieldLocation || "Village / Clinic (Optional)"}
            </label>
            <input
              id="ashaLocationInput"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={
                copy.ashaFieldLocationPlaceholder ||
                "e.g. Rampur Village / PHC Clinic"
              }
            />
          </div>

          <label className="asha-checkbox-row">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              disabled={existingContacts.length === 0}
            />
            <span>
              {copy.ashaFieldPrimary ||
                "Use as primary 1-tap quick-call contact"}
            </span>
          </label>

          {errorMsg && (
            <div className="asha-form-error" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="asha-modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              {copy.ashaCancelBtn || "Cancel"}
            </button>
            <button type="submit" className="btn solid">
              {copy.ashaSaveBtn || "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AshaDoctorModal({
  isOpen,
  editingContact,
  existingContacts,
  copy,
  onClose,
  onSave,
  onToast
}) {
  if (!isOpen) return null;

  return (
    <AshaDoctorModalDialog
      key={editingContact ? editingContact.id : "new"}
      editingContact={editingContact}
      existingContacts={existingContacts}
      copy={copy}
      onClose={onClose}
      onSave={onSave}
      onToast={onToast}
    />
  );
}
