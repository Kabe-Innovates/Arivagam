# learner.saveetha.in — Reverse Engineering Report

## Tech Stack

- **Backend**: Django (Python) — server-rendered HTML, `/static/` and `/media/` patterns
- **Frontend Template**: SB Admin (Bootstrap 5 admin template)
- **CSS**: Bootstrap 5, Bootstrap Icons, FontAwesome
- **JS Libraries**: Chart.js, Simple DataTables
- **Auth**: OAuth2/OIDC SSO via `accounts.saveetha.in` (PKCE, scopes: openid profile email offline_access groups)
- **PWA**: Service worker (`pwa.js`), cache name `sec-pwa-v2-app`, web manifest at `/manifest.webmanifest`
- **Storage**: localStorage key `sec-host-recovery`, sessionStorage key `sec-host-identity-ready`

## Architecture

Server-side rendered Django views. No SPA. Each page is a full HTML document with shared nav sidebar. One XHR endpoint found (`/people/sidebar-profile/`). Heavy caching via service worker.

## Django Apps (inferred from URL prefixes)

| App | URL Prefix | Purpose |
|-----|-----------|---------|
| academics | `/academics/` | Schedule, circulars, attendance, workflow, services, subjects |
| people | `/people/` | Profile, sidebar profile API |
| rewards | `/rewards/` | Reward points tracking |
| academicevents | `/academicevents/` | Event session booking |
| mentormentee | `/mentormentee/` | Mentor-mentee groups, mentorship |
| sso | `/sso/` | SSO callback, login redirect |

## URL Map

### Auth
| Method | Path | Status | Description |
|--------|------|--------|-------------|
| GET | `/` | 302 | Redirects to `/academics/people_schedule/` |
| GET | `/sso/login/?next=/` | 302 | Redirects to `accounts.saveetha.in/authorize/` |
| GET | `/sso/callback/` | — | OAuth2 callback (code exchange) |

### Core — Schedule
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/people_schedule/` | Weekly schedule/timetable (default landing page) |
| GET | `/academics/people_schedule/?year=Y&month=M&day=D` | Schedule for specific date |

**Schedule page shows:**
- Monthly calendar with day navigation (week view)
- Slot cards with: slot code, time range, venue
- Attendance status (Leave Approved, GatePass, etc.)
- Links to VIEW ATTENDANCE and subject settings

### Core — Circulars
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/circulars/` | Circular list with filters |

**Filters:** Title (text search), Role (All/Manager/Mentor/Participant), From Date, To Date, Info checkbox, Notification checkbox
**Badge:** Shows unread count (e.g., "19")

### Core — Reward Points
| Method | Path | Description |
|--------|------|-------------|
| GET | `/rewards/my-reward-points/` | Reward points ledger |
| GET | `/rewards/my-reward-points/general-information/8/` | Reward policy document |

**Filters:** Reward Term dropdown (All Terms, yearly terms, SKILL DEV)
**Table columns:** #, Reward Term, Date, Debit, Credit, Balance, Description
Shows opening balance per term.

### Core — Workflow Requests
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/workflow-requests/` | User's workflow requests |
| GET | `/academics/workflow-requests/{id}/` | Single request detail |

**Filters:** Approval Status (All/New/Pending/Approved/Rejected/Review), From date, To date
**Sections:** General Letters, Leave Applications
**Each request shows:** Title, created date, status, workflow type, Open link

### Core — Workflow Approvals
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/workflow-approvals/` | Approvals dashboard |

**Filters:** Your Approval Status, Overall Status, Approval Type
**Approval types:** General Letters, Event Applications, Leave Applications, Manual Academic Attendance, Manual Event Attendance, Reward Claims

### Core — Event Bookings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academicevents/event-booking/` | Event session booking |

**Filters:** Event Term (dropdown with many terms like 25-26-LEARNING, 26-27-EVENTS, etc.), From Date, To Date, Event Title (search)

### Core — Services
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/services/` | Service directory |
| GET | `/academics/subject-enrollment/` | Subject enrollment |
| GET | `/academics/view-consolidated-attendance/` | Consolidated attendance view |
| GET | `/academics/calculate-my-attendance/` | Attendance calculator |

**Services listed:**
1. SubjectEnrollment — Choose subjects, plan timetable
2. View Consolidated Attendance — Cross-session attendance
3. Calculate My Attendance — Current slot attendance details
4. LeaveRedemption — (truncated in capture)

### Manage — Mentees
| Method | Path | Description |
|--------|------|-------------|
| GET | `/mentormentee/mentees/` | Mentor's mentee groups |

Shows alert when no groups assigned.

### Manage — Mentorship
| Method | Path | Description |
|--------|------|-------------|
| GET | `/mentormentee/mentorship/` | Mentorship groups list |
| GET | `/mentormentee/groups/{id}/mentorship/` | Group detail |

**Group types:** AcademicMentor, HostelMentor, AcademicMentorLog
**Each group shows:** Code, type, status, mentors count, mentees count, user role

### Attendance
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/attendance_process/?slotsession_id=X&slot_id=Y&year=Y&month=M&day=D` | Attendance process page |

**Flow (OTP-based):**
1. Class Started (scheduled time)
2. IN OTP Entry — student enters faculty-generated OTP
3. IN APPROVAL — faculty approves
4. OUT OTP Entry — student enters OUT OTP
5. OUT APPROVAL — faculty approves
6. Feedback Submission
7. ATTENDANCE RECORDED

### Student Subjects
| Method | Path | Description |
|--------|------|-------------|
| GET | `/academics/studentsubjects/` | All subjects list |
| GET | `/academics/studentsubjects/{slot_id}/` | Subject detail |

**Detail tabs:** Overview, Chat, Attendance, Sessions, Feedback
**Overview shows:** Student info, LMS links, Slot info, Course Outcome
**Stats:** Overall Attendance, Total Sessions, Upcoming count, Feedback Status, Session Timeline

### Profile
| Method | Path | Description |
|--------|------|-------------|
| GET | `/people/profile/` | User profile edit |

**Fields:** Profile Photo (JPG/PNG/WebP, max 2MB), LinkedIn URL, GitHub URL, About Myself
**Actions:** Edit photo, Remove Photo, Save Profile

### API Endpoints (XHR/Fetch)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/people/sidebar-profile/` | Sidebar user profile data (fetch) |

## User Identity Model

From captured session:
- **Student ID:** 24900985
- **Name:** KABELAN G K
- **Ref1:** 212224110027 (Register Number)
- **Ref2:** 24900985
- **Profile photo:** `/media/people_profiles/64/2026/07/14/{hash}_64.webp`

## Navigation Structure

**Sidebar sections:**
1. **Core**
   - Schedule (default landing)
   - Circulars (with badge count)
   - My Reward Points
   - Workflow Requests
   - Workflow Approvals
   - Bookings
   - Services
2. **Manage**
   - Mentees
   - Mentorship
   - Academics (submenu, `#`)
   - Activities (submenu, `#`)
3. **User section**
   - Profile photo, ID, name, references

**Top bar:** Logo (links to `/`), hamburger toggle, notification area (shows `1651.60:1766.60` — likely reward points balance)

## Key Observations for Pitch

1. **Server-side rendered** — every navigation is a full page load. No SPA, no client-side routing. Performance suffers on slow connections.
2. **OTP-based attendance** — interesting but complex. Faculty generates OTP, students enter it. Good anti-proxy measure.
3. **PWA with aggressive caching** — good for offline access, but pages served from SW cache don't get fresh data.
4. **No visible REST API** — only one XHR endpoint found (`sidebar-profile`). All data is embedded in HTML. This makes extensions hard.
5. **SB Admin template** — generic admin template, not custom UI. Mobile experience likely suboptimal.
6. **No WebSocket** — no real-time updates (circulars, notifications).
7. **Reward points system** — gamification layer with credit/debit ledger per term.
8. **Multi-level approval workflow** — supports General Letters, Leave, Events, Attendance, Rewards.

## Data Models (Inferred)

### Person
- id, name, register_number, student_id, ref1, ref2
- profile_photo (WebP, stored in `/media/people_profiles/`)
- linkedin_url, github_url, about

### AcademicSlot
- slot_id, slot_code (e.g., "2627HOS008")
- name (e.g., "HOS – HOSTEL ATTENDANCE")
- academic_term, venue
- start_time, end_time
- session_timeline (start_date, end_date)
- total_sessions, upcoming_count

### SlotSession
- slotsession_id, slot_id
- date, start_time, end_time
- attendance_status (enum)

### Attendance
- person, slotsession
- in_otp_entry, in_approval
- out_otp_entry, out_approval
- feedback_submitted
- status (enum: scheduled, in_progress, recorded)

### Circular
- title, role (Manager/Mentor/Participant)
- type (Info/Notification)
- date, content

### RewardTransaction
- person, reward_term
- date, debit, credit, balance
- description

### WorkflowRequest
- id, type (General Letter, Leave Application, Event Application)
- title, description
- created_date, status (Draft/New/Pending/Approved/Rejected/Review)
- workflow_name

### WorkflowApproval
- request, approver
- approval_status (Pending/Approved/Rejected/Skipped/Queued)
- approval_type

### EventBooking
- event_term, session
- person, booking_date

### MentorMenteeGroup
- id, code (e.g., "ACAM125")
- type (AcademicMentor/HostelMentor/AcademicMentorLog)
- status (Active/Inactive)
- mentors (many-to-many Person)
- mentees (many-to-many Person)

### StudentSubject
- person, slot
- enrollment_mode (Class)
- overall_attendance, feedback_status

### Service
- name, description, url_path
