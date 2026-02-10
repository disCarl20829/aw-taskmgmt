import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardBoards = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const colors = {
    topNav: '#1d4e89',
    bg: '#5a8fb8',
    boardHeader: '#4a7089',
    listYellow: '#c9a857',
    listGreen: '#4a7c59',
    listBlue: '#5a7c8f',
    listGrey: '#b8c5d0',
    cardBg: '#2e3c4d'
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: colors.topNav }}>
        <div className="d-flex align-items-center gap-3">

          <button className="btn btn-sm p-1" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="white">
              <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
            </svg>
          </button>

          <button className="btn btn-sm p-1" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#f4d03f">
              <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z"/>
            </svg>
          </button>
          
          <span className="fw-bold" style={{ fontSize: '15px' }}>My board-board</span>
        </div>
        
        <input 
          type="text" 
          placeholder="Search" 
          className="form-control form-control-sm" 
          style={{ maxWidth: '500px', backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', fontSize: '14px' }}
        />
        
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-primary btn-sm px-3" style={{ fontSize: '14px' }}>Create</button>

          <button className="btn btn-sm p-1" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white">
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/>
            </svg>
          </button>

          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px', cursor: 'pointer' }}>
            AW
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: colors.boardHeader }}>
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>My board</h6>

          <button className="btn btn-sm p-0" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white">
              <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z"/>
            </svg>
          </button>
        </div>
        
        <div className="d-flex align-items-center gap-2 position-relative">

          <button className="btn btn-sm p-1" style={{ border: 'none' }} onClick={() => setActiveMenu(activeMenu === 'profile' ? null : 'profile')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white">
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
            </svg>
          </button>

          <button className="btn btn-sm p-1" style={{ border: 'none' }} onClick={() => setActiveMenu(activeMenu === 'filter' ? null : 'filter')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white">
              <path d="M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
            </svg>
          </button>

          <button className="btn btn-sm p-1" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white">
              <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/>
            </svg>
          </button>

          <button className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1" style={{ fontSize: '13px' }} onClick={() => setActiveMenu(activeMenu === 'share' ? null : 'share')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
              <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z"/>
            </svg>
            <span>Share</span>
          </button>

          <button className="btn btn-sm p-1" style={{ border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="white">
              <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
            </svg>
          </button>

          {activeMenu === 'profile' && (
            <div className="position-absolute shadow-lg" style={{ top: '45px', right: 0, width: '280px', backgroundColor: 'white', borderRadius: '8px', zIndex: 1000, overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#e9f0f8', color: 'black', padding: '20px', textAlign: 'center', position: 'relative' }}>
                <div className="position-absolute top-0 end-0 p-2" style={{ cursor: 'pointer', fontSize: '24px', fontWeight: 'bold' }} onClick={() => setActiveMenu(null)}>×</div>
                <div className="rounded-circle mx-auto mb-2" style={{ width: '70px', height: '70px', backgroundColor: '#ccc', border: '3px solid white' }}></div>
                <h6 className="mb-0 fw-bold">User123</h6>
                <div className="text-muted small">@User123</div>
              </div>
              <div className="p-2">
                <div className="p-2 small text-dark" style={{ cursor: 'pointer' }}>Edit profile info</div>
                <hr className="my-1 opacity-25" />
                <div className="p-2 small text-dark" style={{ cursor: 'pointer' }}>View member's board activity</div>
              </div>
            </div>
          )}

          {activeMenu === 'filter' && (
            <div className="position-absolute shadow-lg p-3" style={{ top: '45px', right: 0, width: '300px', backgroundColor: 'white', borderRadius: '8px', zIndex: 1000, color: 'black' }}>
              <div className="d-flex justify-content-between mb-3">
                <div className="flex-grow-1 text-center small fw-bold">Filter</div>
                <div style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setActiveMenu(null)}>×</div>
              </div>
              <label className="small fw-bold mb-1">Keyword</label>
              <input type="text" className="form-control form-control-sm mb-1" placeholder="Enter a keyword..." />
              <div style={{ fontSize: '10px', color: '#666' }} className="mb-3">Search cards, members, labels, and more.</div>
              
              <div className="mb-3">
                <div className="small fw-bold mb-2">Members</div>
                <div className="form-check small"><input type="checkbox" className="form-check-input" id="noMembers" /> <label htmlFor="noMembers">No members</label></div>
                <div className="form-check small"><input type="checkbox" className="form-check-input" id="assignedToMe" /> <label htmlFor="assignedToMe">Cards assigned to me</label></div>
              </div>
              
              <div className="mb-3">
                <div className="small fw-bold mb-2">Card status</div>
                <div className="form-check small"><input type="checkbox" className="form-check-input" id="complete" /> <label htmlFor="complete">Marked as complete</label></div>
                <div className="form-check small"><input type="checkbox" className="form-check-input" id="notComplete" /> <label htmlFor="notComplete">Not marked as complete</label></div>
              </div>
            </div>
          )}

          {activeMenu === 'share' && (
            <div className="position-absolute shadow-lg p-3" style={{ top: '45px', right: 0, width: '320px', backgroundColor: 'white', borderRadius: '8px', zIndex: 1000, color: 'black' }}>
              <div className="d-flex justify-content-between mb-3">
                <div className="fw-bold">Share</div>
                <div style={{ cursor: 'pointer', fontSize: '20px' }} onClick={() => setActiveMenu(null)}>×</div>
              </div>
              <div className="mb-3 p-2 border rounded" style={{ cursor: 'pointer' }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#666">
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                  </svg>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">Private</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>Board members and Workspace admins can see and edit this board.</div>
                  </div>
                </div>
              </div>
              <div className="mb-3 p-2 border rounded" style={{ cursor: 'pointer' }}>
                <div className="fw-bold small mb-1">Workspace</div>
                <div className="text-primary small">All members of the Workspace can see and edit this board.</div>
              </div>
              <div className="p-2 border rounded" style={{ cursor: 'pointer' }}>
                <div className="fw-bold small mb-1">Public</div>
                <div style={{ fontSize: '11px', color: '#666' }}>Anyone on the internet can see this board. Only board members can edit.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex p-3 gap-3 align-items-start" style={{ overflowX: 'auto' }}>
        
        <div className="rounded p-2" style={{ backgroundColor: colors.listYellow, width: '270px', minWidth: '270px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <span className="fw-bold small">Today</span>
            <button className="btn btn-sm p-0" style={{ border: 'none', fontSize: '18px' }}>⋯</button>
          </div>
          <div className="bg-white rounded p-2 mb-2 shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-2">
              <input type="checkbox" checked readOnly style={{ accentColor: colors.listGreen, width: '16px', height: '16px' }} />
              <span className="small">Wash</span>
              <button className="btn btn-sm p-0 ms-auto" style={{ border: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#666">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
                </svg>
              </button>
            </div>
            <div style={{ height: '6px', width: '40px', backgroundColor: colors.listGreen, borderRadius: '3px' }}></div>
          </div>
          <button className="btn btn-sm w-100 text-start p-1" style={{ border: 'none', fontSize: '13px' }}>+ Add a card</button>
        </div>

        <div className="rounded p-2" style={{ backgroundColor: colors.listGreen, width: '270px', minWidth: '270px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <span className="fw-bold small">This week</span>
            <button className="btn btn-sm p-0" style={{ border: 'none', fontSize: '18px' }}>⋯</button>
          </div>
          <button className="btn btn-sm w-100 text-start p-1" style={{ border: 'none', fontSize: '13px' }}>+ Add a card</button>
        </div>

        <div className="rounded p-2" style={{ backgroundColor: colors.listBlue, width: '270px', minWidth: '270px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <span className="fw-bold small">Later</span>
            <button className="btn btn-sm p-0" style={{ border: 'none', fontSize: '18px' }}>⋯</button>
          </div>
          <button className="btn btn-sm w-100 text-start p-1" style={{ border: 'none', fontSize: '13px' }}>+ Add a card</button>
        </div>

        <button className="rounded p-3 text-center" style={{ backgroundColor: colors.listGrey, width: '270px', minWidth: '270px', cursor: 'pointer', border: 'none', opacity: 0.8 }}>
          <span className="fw-bold small">+ Add another list</span>
        </button>
      </div>

      <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
        <div className="d-flex gap-0 rounded-pill overflow-hidden shadow" style={{ backgroundColor: colors.cardBg }}>
          <button className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: 'transparent', color: 'white', border: 'none', borderRadius: '20px 0 0 20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
              <path d="M160-160v-640l480 320-480 320Zm80-320Zm0 134 230-154-230-154v308Z"/>
            </svg>
            <span className="small">Inbox</span>
          </button>
          <button className="btn btn-primary btn-sm px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '0' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
              <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h200v-400H160v400Zm280 0h200v-400H440v400Zm280 0h80v-400h-80v400Z"/>
            </svg>
            <span className="small fw-bold">Board</span>
          </button>
          <button className="btn btn-sm px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: 'transparent', color: 'white', border: 'none', borderRadius: '0 20px 20px 0' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="white">
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
            </svg>
            <span className="small">Switch board</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardBoards;