# Online Course Service - Final Exam

## Student Information
- Student Name: Seng Ban Nu
- Student ID: 6622007

## Test credentials
| Username | Email | Password | Role |
|---|---|---|---|
| teacher1 | teacher1@test.com | teacher123 | Teacher |
| teacher2 | teacher2@test.com | teacher123 | Teacher |
| teacher3 | teacher3@test.com | teacher123 | Teacher |
| student1 | student1@test.com | student123 | Student |
| student2 | student2@test.com | student123 | Student |
| student3 | student3@test.com | student123 | Student |

## Prerequisites and environment
Use Node.js compatible with the supplied Next.js/Vite versions (Node 22.12+), npm, and MongoDB Atlas. Allow the required network access through grading.
Backend .env.local / Vercel variables:
MONGODB_URI = your database connection string
MONGODB_DB = wad_final_2026
JWT_SECRET = a long random secret
ADMIN_SETUP_PASS = your private setup secret
FRONTEND_URL = http://localhost:5173 locally; live frontend origin in production.
The frontend uses relative API requests. Keep VITE_API_URL unset; no database/JWT secrets belong in the frontend.

## Run
1. In next-backend: npm install, fill .env.local, npm run dev (port 3000).
2. Create the six accounts once with POST /api/setup, JSON {"pass":"YOUR_ADMIN_SETUP_PASS"}. Example: curl -X POST http://localhost:3000/api/setup -H 'Content-Type: application/json' -d '{"pass":"YOUR_ADMIN_SETUP_PASS"}'. Repeating setup does not overwrite existing users.
3. In react-frontend: npm install, npm run dev. Open http://localhost:5173.
4. Run npm run build in each project before deployment.

## Testing walkthrough
1. Login teacher1. Create an Open course with name, positive duration, multiple topics, price and Max Student=1.
2. Open details and edit fields. Empty courses can be deleted. Create a second empty course and delete it to test.
3. Login teacher2: teacher1's courses must not appear. Direct API access to teacher1's course must return 403.
4. Login student1: search by part of course name and teacher1; open details and enroll. The course appears under My enrollments. Refresh retains login.
5. Attempt duplicate enrollment: the UI shows already enrolled and the API rejects repeats with 409.
6. Login student2: enrollment in the full course is blocked; API returns 409.
7. Login teacher1: details show student1's username/email. Deletion is blocked when enrollment exists. Max Student cannot be reduced below enrollment count.
8. Change status to Close: Students can still view it but cannot enroll. Change to Cancel: it disappears from Student lists and Student detail access is blocked. Teacher can still manage the course. Change back to Open to reopen.
9. Logout and request GET /api/course without cookie: 401. Student creating/editing/deleting a course: 403. Teacher attempting enrollment: 403.
10. Test all six logins. Invalid login returns 401; invalid data returns 400. Check live site in Incognito and refresh hash routes.

## API
POST /api/auth/login: {"email":"teacher1@test.com","password":"teacher123"}; username can also be used.
POST /api/auth/logout; GET /api/user; GET /api/user/{own-user-id}.
GET /api/course?name=part&teacher=part; Student enrolled list: ?enrolled=true.
POST /api/course: {"courseName":"Web","duration":5,"topics":["HTML","React"],"price":100,"maxStudent":2,"status":"Open"}.
GET/PATCH/PUT/DELETE /api/course/{course_id}; POST /api/course/{course_id}/enroll.
POST /api/setup: secret-protected initial test data creation.
Authentication uses an HTTP-only JWT cookie (Bearer tokens also supported for API tests). Logout invalidates tokens for that account using a database session version. Proxy checks tokens and routes independently enforce roles and ownership. Student IDs are derived from the authenticated account.
Course enrollment is embedded in the course document. One atomic MongoDB operation checks Open status, remaining seats and duplicate enrollment, preventing overbooking. Edits/deletes have atomic enrollment-count conditions too. Students never receive another student's personal enrollment data. Cancel courses are excluded from all Student lists, including My enrollments; enrollment records remain for the Teacher and reappear if reopened.

## Deployment
Deploy next-backend as Next.js and react-frontend as Vite (build npm run build, output dist), preferably as two GitHub repositories. Before frontend deployment, replace YOUR-BACKEND in react-frontend/vercel.json with the backend production hostname and push. HashRouter preserves the supplied architecture and supports refresh without SPA fallback rewrites. Set backend FRONTEND_URL to the frontend origin and redeploy. Setup must run against the same configured database. Never commit .env.local; configure Vercel separately.

## Submission
- Backend repository: ADD URL
- Frontend repository: ADD URL
- Backend deployment: ADD URL
- Frontend deployment: ADD URL
- Entire-screen and camera recording link: ADD LINK

## Changes to starter
Implemented all placeholder routes and UserProvider. Preserved src/lib helpers, proxy.js, API route paths and HashRouter. Fixed production MongoDB connection reuse, configurable CORS, proxy route matching/preflight, and remote-font build dependency. Comments identify fixes. Added only necessary setup/enrollment endpoints, frontend deployment config and documentation. Existing dependency versions are retained unless installation verification notes say otherwise.

## Submission Links

Frontend repository: https://github.com/Seng-ban-nu/course-frontend
Backend repository: https://github.com/Seng-ban-nu/course-backend
Frontend website: https://course-frontend-delta.vercel.app/
Backend website: https://course-backend-pied.vercel.app/
Screen recording: ADD_YOUR_RECORDING_LINK
