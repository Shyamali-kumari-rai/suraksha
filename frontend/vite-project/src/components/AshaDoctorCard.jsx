import { formatDisplayPhone } from "../utils/ashaStorage";

export default function AshaDoctorCard({
  contacts,
  copy,
  onAddClick,
  onEditClick,
  onDeleteClick
}) {
  const hasContacts = contacts.length > 0;
  const canAddSecond = contacts.length === 1;

  return (
    <div className="asha-card" id="ashaDoctorCard">
      <div className="asha-card-head">
        <div className="asha-card-title-wrap">
          <div className="asha-card-icon" aria-hidden="true">
            🩺
          </div>
          <div>
            <h3>{copy.ashaHeading || "ASHA / Doctor"}</h3>
            <p className="asha-card-sub">
              {copy.ashaSubtitle ||
                "Save your village ASHA worker or local doctor for instant 1-tap calling — works offline."}
            </p>
          </div>
        </div>
      </div>

      {!hasContacts ? (
        <div className="asha-empty">
          <p className="asha-empty-text">
            {copy.ashaEmptyDesc ||
              "In villages, calling your local ASHA health worker or doctor is often faster than waiting for an ambulance. Save their number once for 1-tap offline calling."}
          </p>
          <button
            type="button"
            className="asha-primary-cta"
            onClick={onAddClick}
          >
            {copy.ashaEmptyCta || "+ Save ASHA / Doctor Number"}
          </button>
        </div>
      ) : (
        <>
          <div className="asha-list">
            {contacts.map((contact) => {
              const roleLabel =
                contact.role === "doctor"
                  ? copy.ashaRoleDoctor || "Doctor"
                  : copy.ashaRoleAsha || "ASHA";

              return (
                <div key={contact.id} className="asha-contact-item">
                  <div className="asha-contact-info">
                    <div className="asha-badges">
                      <span
                        className={`asha-role-badge ${
                          contact.role === "doctor" ? "doctor" : "asha"
                        }`}
                      >
                        {roleLabel}
                      </span>
                      {contact.isPrimary && (
                        <span className="asha-primary-badge">
                          ★ {copy.ashaPrimaryBadge || "Primary"}
                        </span>
                      )}
                    </div>
                    <div className="asha-contact-name">{contact.name}</div>
                    {contact.location && (
                      <div className="asha-contact-loc">📍 {contact.location}</div>
                    )}
                    <div className="asha-contact-phone">
                      {formatDisplayPhone(contact.phone)}
                    </div>
                  </div>

                  <div className="asha-contact-actions">
                    <a
                      className="asha-call-btn"
                      href={`tel:${contact.phone}`}
                      aria-label={`${copy.ashaCallNow || "Call Now"} ${contact.name}`}
                    >
                      📞 {copy.ashaCallNow || "Call Now"}
                    </a>
                    <div className="asha-secondary-actions">
                      <button
                        type="button"
                        className="asha-subtle-btn"
                        onClick={() => onEditClick(contact)}
                        aria-label={`${copy.ashaEdit || "Edit"} ${contact.name}`}
                      >
                        ✎ {copy.ashaEdit || "Edit"}
                      </button>
                      <button
                        type="button"
                        className="asha-subtle-btn danger"
                        onClick={() => onDeleteClick(contact.id)}
                        aria-label={`${copy.ashaDelete || "Delete"} ${contact.name}`}
                      >
                        🗑 {copy.ashaDelete || "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {canAddSecond && (
            <div className="asha-footer-action">
              <button
                type="button"
                className="asha-add-second-btn"
                onClick={onAddClick}
              >
                {copy.ashaAddSecondCta || "+ Add Second Contact"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
