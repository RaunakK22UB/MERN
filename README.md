📎 Affiliate++ – Affiliate Link Sharing Platform
Affiliate++ is a web-based SaaS platform designed to help content creators, marketers, and businesses manage affiliate links effectively. It simplifies link creation, tracking, and analytics, making affiliate marketing smarter and more efficient.

🚀 Features
✅ Create & Organize Affiliate Links
✅ Shorten URLs for Easy Sharing
✅ Click & Conversion Analytics
✅ Role-Based Access Control
✅ Campaign Categorization
✅ Engagement Insights

💡 Problem Statement
Affiliate marketing is a powerful monetization strategy, but managing links manually often results in:

Loss of tracking data

Duplication of links

Poor visibility into performance

Affiliate++ solves these challenges with a secure and scalable platform for managing affiliate campaigns.

👥 Target Audience
Content Creators (YouTubers, Bloggers, Influencers)

Digital Marketing Agencies

Small Business Owners & Entrepreneurs

Students & College Clubs

Affiliate Program Managers

📌 Use Cases
🔗 A YouTuber tracks which affiliate links get the most clicks.
📧 A Digital Marketing Agency measures campaign performance.
🛒 An E-commerce Seller analyzes which Instagram posts drive sales.
🎓 A Student Ambassador shares bootcamp links and monitors engagement.

🛠 Tech Stack
Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT

Hosting: https://wonderful-lamington-c5be41.netlify.app/

📂 Folder Structure
bash
Copy
Edit
/client        # React frontend
/server        # Node.js backend
/README.md     # Project Documentation
🚧 Installation
Clone the repo and run locally:

bash
Copy
Edit
git clone https://github.com/RaunakK22UB/MERN.git
cd MERN
npm install
npm run dev
📸 Screenshots
![Analytics Dashboard](https://github.com/RaunakK22UB/MERN/blob/main/mern-project-1/public/image.png?raw=true)



```
MERN_summer
├─ image.png
├─ mern-project-1
│  ├─ build
│  │  ├─ asset-manifest.json
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  │  ├─ static
│  │  │  ├─ css
│  │  │  │  ├─ main.cc388f9e.css
│  │  │  │  └─ main.cc388f9e.css.map
│  │  │  └─ js
│  │  │     ├─ main.b61f63b4.js
│  │  │     ├─ main.b61f63b4.js.LICENSE.txt
│  │  │     └─ main.b61f63b4.js.map
│  │  └─ _redirects
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ image.png
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  ├─ robots.txt
│  │  └─ _redirects
│  ├─ README.md
│  └─ src
│     ├─ App.css
│     ├─ App.js
│     ├─ components
│     │  └─ UnauthorizeAccess.js
│     ├─ config
│     │  ├─ config.js
│     │  └─ payments.js
│     ├─ index.js
│     ├─ layout
│     │  ├─ AppLayout.js
│     │  ├─ Footer.js
│     │  ├─ Header.js
│     │  ├─ UserFooter.js
│     │  ├─ UserHeader.js
│     │  └─ UserLayout.js
│     ├─ pages
│     │  ├─ Dashboard.js
│     │  ├─ Error.js
│     │  ├─ ForgotPassword.js
│     │  ├─ Home.js
│     │  ├─ links
│     │  │  ├─ AnalyticsDashboard.js
│     │  │  └─ LinksDashboard.js
│     │  ├─ Login.js
│     │  ├─ Logout.js
│     │  ├─ manageUsers
│     │  │  └─ manageUsers.js
│     │  ├─ payments
│     │  │  ├─ DeletedManagePayment.js
│     │  │  ├─ ManagePayments.js
│     │  │  ├─ PurchaseCredit.css
│     │  │  ├─ PurchaseCredit.js
│     │  │  └─ Subscription.js
│     │  ├─ Register.js
│     │  └─ ResetPassword.js
│     ├─ rbac
│     │  ├─ Can.js
│     │  ├─ ProtectedRoute.js
│     │  └─ userPermissions.js
│     └─ redux
│        ├─ store.js
│        └─ user
│           ├─ actions.js
│           └─ reducer.js
├─ mern-project-server
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ scripts
│  │  └─ addUser.js
│  ├─ server.js
│  └─ src
│     ├─ constants
│     │  ├─ paymentConstant.js
│     │  ├─ permissions.js
│     │  └─ userConstants.js
│     ├─ controller
│     │  ├─ authController.js
│     │  ├─ linksController.js
│     │  ├─ paymentController.js
│     │  └─ userController.js
│     ├─ dao
│     ├─ middleware
│     │  ├─ authMiddleware.js
│     │  └─ authorizeMiddleware.js
│     ├─ model
│     │  ├─ Clicks.js
│     │  ├─ Links.js
│     │  └─ Users.js
│     ├─ routes
│     │  ├─ authRoutes.js
│     │  ├─ linksRoutes.js
│     │  ├─ paymentRoutes.js
│     │  └─ userRoutes.js
│     ├─ service
│     │  └─ emailService.js
│     └─ util
│        ├─ authUtil.js
│        └─ linkUtil.js
└─ README.md

```