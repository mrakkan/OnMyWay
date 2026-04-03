# OnMyWay

Starter project with:
- React + Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- React Router

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Routes

### Public

- `/` -> Landing page
- `/signin` -> User sign in
- `/signup` -> User sign up
- `/track-driver` -> Track driver page

### Ride Layout (Shared Navbar/Bottom Nav)

- `/find-ride` -> Find ride page
- `/schedule` -> My schedule page
- `/profile` -> User profile page
- `/chat` -> Driver chat page
- `/chat/:driverId` -> Driver chat by driver id
- `/driver-chat` -> Driver chat page
- `/driver-chat/:driverId` -> Driver chat by driver id
- `/driver/:driverId` -> Driver profile page
- `/driver/:driverId/request` -> Request ride page for selected driver

### Driver

- `/driver` -> Redirect to `/driver/login`
- `/driver/login` -> Driver login
- `/driver/signup` -> Driver registration
- `/driver/dashboard` -> Driver dashboard
- `/driver/my-request` -> Driver requests page
- `/driver/my-works` -> Driver works page
- `/driver/work/:id` -> Work detail by work id
- `/driver/tracking` -> Driver tracking page
- `/driver/tracking/:id` -> Driver tracking by work id
- `/driver/chat` -> Driver-passenger chat
- `/driver/chat/:workId` -> Driver-passenger chat by work id
- `/driver/profile` -> Driver profile
- `/driver/help-center` -> Driver help center

### Admin

- `/admin` -> Redirect to `/admin/login`
- `/admin/login` -> Admin login
- `/admin/dashboard` -> Admin dashboard
- `/admin/manage-driver` -> Manage drivers
- `/admin/driver-request` -> Driver requests management
- `/admin/profile` -> Admin view profile
- `/admin/manage-user` -> Manage users
- `/admin/help-center` -> Admin help center
- `/admin/users/:id` -> User detail by user id

### Fallback

- `*` -> Redirect to `/`
