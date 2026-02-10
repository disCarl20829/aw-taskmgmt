import React, { useState } from "react";

const SettingsPage = () => {
  const [frequency, setFrequency] = useState("Never");

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  return (
    <>
      <style>{`
        .bg-dark-main { background-color: #1d2125; }
        .sidebar { width: 260px; background-color: #1d2125; }
        .sidebar-heading { color: #a8b4c1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        
        .sidebar-btn-link { 
          background: none; border: none; color: #9fadbc; padding: 6px 12px; 
          border-radius: 4px; font-size: 0.9rem; transition: 0.2s;
        }
        .sidebar-btn-link:hover { background-color: #333c44; color: #fff; }
        .sidebar-btn-link.active { background-color: #579dff29; color: #579dff; font-weight: 600; }
        
        .workspace-icon { 
          width: 24px; height: 24px; background: linear-gradient(#e2b203, #ff9f1a); 
          color: #1d2125; display: inline-flex; align-items: center; 
          justify-content: center; border-radius: 3px; font-weight: bold; 
        }
        
        .sidebar-workspace-btn { background: none; border: none; color: #9fadbc; padding: 4px 8px; }
        
        .settings-header-bar { background-color: #2c333a; color: #9fadbc; font-size: 0.85rem; }
        .info-box-disabled { border: 1px solid #333c44; background-color: rgba(0,0,0,0.1); }
        .text-muted-custom { color: #9fadbc; }
        .link-blue { color: #579dff; text-decoration: none; cursor: pointer; font-size: 0.85rem; }
        .link-blue:hover { text-decoration: underline; }
        
        /* Custom Checkbox Styling */
        .checkbox-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .custom-check { 
            width: 16px; height: 16px; border: 2px solid #444; border-radius: 2px; 
            background: transparent; cursor: pointer; margin-top: 3px;
        }
      `}</style>

      <div className="container-fluid vh-100 bg-dark-main text-light d-flex p-0">
        {/* SIDEBAR */}
        <nav className="sidebar p-3 border-end border-secondary border-opacity-25">
          <section className="mb-4">
            <h6 className="sidebar-heading px-2">Personal Settings</h6>
            <div className="d-flex flex-column gap-1 mt-3">
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-person me-2"></i> Profile and Visibilty
              </button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-list-task me-2"></i> Activity
              </button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-card-text me-2"></i> Card
              </button>
              <button className="sidebar-btn-link text-start active">
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </div>
          </section>

          <section>
            <h6 className="sidebar-heading px-2">Workspaces</h6>
            <button className="sidebar-workspace-btn d-flex align-items-center mt-3 mb-2 w-100 text-start">
              <span className="workspace-icon me-2">A</span>
              <span className="fw-bold">Animate Workspace</span>
            </button>
            <div className="d-flex flex-column gap-1 ps-4">
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-kanban me-2"></i> Boards</button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-people me-2"></i> Members</button>
              <button className="sidebar-btn-link text-start">
                <i className="bi bi-gear me-2"></i> Settings</button>
            </div>
          </section>
        </nav>

        <main className="flex-grow-1 p-5 overflow-auto position-relative">
          <button className="btn-close btn-close-white position-absolute top-0 end-0 m-4 shadow-none"></button>

          <div className="mx-auto" style={{ maxWidth: "850px" }}>
            <h3 className="mb-4 fw-bold">Settings</h3>

            <div className="mb-2">
              <div className="settings-header-bar p-2 px-3 rounded-1 mb-3">
                <span className="fw-bold">Account settings</span>
              </div>

              <div className="ps-4">
                <div className="settings-header-bar p-2 px-3 rounded-1 mb-4">
                  <span className="fw-bold">Email notifications</span>
                </div>

                <div className="ps-3 mb-5">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-clock me-2 text-muted-custom"></i>
                    <span className="fw-bold small">Email notifications</span>
                  </div>
                  <p
                    className="text-muted-custom small mb-3"
                    style={{ maxWidth: "550px", lineHeight: "1.4" }}
                  >
                    Email notifications can be sent 'Instantly' (as soon as they
                    occur) or 'Periodically' (hourly). If you'd like to opt-out
                    of all notification emails, set the frequency as 'Never'.
                  </p>

                  <label className="d-block small fw-bold mb-2">
                    Frequency
                  </label>
                  <select
                    className="form-select bg-dark text-light border-secondary w-auto shadow-none btn-sm"
                    style={{ minWidth: "180px", borderColor: "#444" }}
                    value={frequency}
                    onChange={handleFrequencyChange}
                  >
                    <option value="Never">Never</option>
                    <option value="Instantly">Instantly</option>
                    <option value="Periodically">Periodically</option>
                  </select>
                </div>

                <div className="ps-3">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-grid-3x3-gap me-2 text-muted-custom"></i>
                    <span className="fw-bold small">
                      Email notifications preferences
                    </span>
                  </div>

                  {frequency === "Never" ? (
                    /* CASE: NEVER SELECTED */
                    <div className="info-box-disabled p-4 rounded-1">
                      <h6 className="small fw-bold mb-2">
                        Since you've turned off email notifications, these
                        settings don't apply.
                      </h6>
                      <p className="text-muted-custom small mb-3">
                        You won't get any notifications sent to your email
                        inbox.
                      </p>
                      <p className="text-muted-custom small mb-2">
                        If you set your email frequency to 'Periodically' or
                        'Instantly', you can choose to receive emails about:
                      </p>
                      <ul className="text-muted-custom small mb-0 list-unstyled ps-3">
                        <li className="mb-1">• Due dates</li>
                        <li className="mb-1">• Comments</li>
                        <li className="mb-1">• Attachments</li>
                        <li className="mb-1">• Card movements</li>
                        <li>• and more...</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-custom small mb-3">
                        These preferences only apply to email notifications for
                        boards, lists, and cards you're{" "}
                        <span className="link-blue">watching</span>. Select
                        which notifications you'd like to receive via email.
                      </p>
                      <p className="text-muted-custom small mb-3">
                        Note: You'll always get emails for invites, direct
                        mentions, when you're added to a card, and more.
                      </p>

                      <div className="d-flex gap-2 mb-4">
                        <span className="link-blue small">Select all</span>
                        <span className="text-muted-custom small">|</span>
                        <span className="link-blue small">Select none</span>
                      </div>

                      {[
                        {
                          title: "Comments",
                          desc: "New comments added on cards you're watching",
                        },
                        {
                          title: "Due dates",
                          desc: "Due dates are added, changed, or approaching on a card you're watching",
                        },
                        {
                          title: "You're removed from a card",
                          desc: "Someone removes you as a member from a card",
                        },
                        {
                          title: "Attachments added",
                          desc: "Files or links added to cards you're watching",
                        },
                        {
                          title: "Cards created",
                          desc: "New cards created on boards you're watching",
                        },
                        {
                          title: "Cards moved",
                          desc: "Cards you're watching are moved between lists or boards",
                        },
                        {
                          title: "Cards archived",
                          desc: "Cards you're watching are archived (or unarchived)",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="checkbox-item">
                          <input type="checkbox" className="custom-check" />
                          <div>
                            <div className="small fw-bold">{item.title}</div>
                            <div className="text-muted-custom small">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SettingsPage;
