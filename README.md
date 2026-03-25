# 🌿 KisanConnect 

![KisanConnect Banner](https://via.placeholder.com/1000x300.png?text=KisanConnect+-+Empowering+Farmers+and+Wholesalers)

**KisanConnect** is a modern, fully functional B2B full-stack platform built to bridge the gap between Farmers and Agricultural Wholesalers. The platform features an advanced localized bidding system, an inventory management hub, AI-driven market price tracking, and a robust Node.js backend powered by SQLite.

## ✨ Key Features

### 🧑‍🌾 Farmer Portal
* **My Crops Dashboard:** Easily list agricultural produce by type, quality, and quantity.
* **AI Price Suggestion Meter:** Instantly compares the farmer's asking price against current market averages (Wheat, Soybean, Cotton, etc.) to optimize sales.
* **Wholesaler Bids:** Review, accept, or reject active bids directly from wholesalers on listed crops.
* **Equipment Hub:** A full rental system where farmers can browse equipment, filter by local villages (Andhra Pradesh/Telangana/Maharashtra), and list their own machinery using an availability calendar.
* **Payment Settings:** Manage Online (UPI/QR Code) and Offline (Cash on Delivery) modes, while segregating total earnings into explicit "Pending" and "Paid" trackers.

### 🏭 Wholesaler Portal
* **Advanced "Browse & Bid" Engine:** A triple-tab layout that allows Wholesalers to effortlessly switch between Placing Bids, Contacting Farmers directly via a directory, and analyzing AI Market Price Trends.
* **Crop Listings Explorer:** Powerful filters allow zooming into specific geographic locations and crop varieties to find the perfect bulk deals.
* **Active Bid Tracker:** Monitor the status of outgoing bids (Pending, Accepted) and proceed to checkout natively upon a Farmer's approval.

### 🌐 Global Mechanics
* **Robust Backend Infrastructure:** Migrated from a frontend-only state to a fully structured Express.js and SQLite database backend that securely persists Users, Crops, Equipment, and Bids.
* **Smart UI Binding:** Client-side HTML pages seamlessly fetch REST API endpoints locally to keep the user experience perfectly synced in real-time.
* **Automated Mock Engine:** Features like the Wholesaler Bidding automatically trigger server-side asynchronous events to simulate realistic incoming negotiations for demo purposes.
* **Multi-Language Engine:** A functional i18n dynamic translation module converting core navigation elements instantly between **English**, **Hindi**, and **Telugu**.
---

## 💻 Tech Stack

KisanConnect is a fast, responsive, tightly integrated full-stack application built over modern standards.
* **Frontend:** Semantic `HTML5`, Custom `CSS3`, Vanilla `JavaScript` (ES6+), Bootstrap 5.
* **Backend Runtime:** `Node.js` with `Express.js`.
* **Database & ORM:** `SQLite` orchestrated elegantly using `Sequelize` strictly enforcing Data Models and relationships.
* **Typography:** `Google Fonts` (Inter).
---

## 🚀 How to Run Locally

Get up and running locally in seconds. The application comes pre-configured with SQLite logic so no database installation is required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/kisanconnect.git
   cd kisanconnect
   ```
2. **Install all Backend Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Express Server:**
   ```bash
   node server.js
   ```
4. **Access the Application:**
   Open your browser and navigate automatically to port 3000 mapping:
   ```text
   http://localhost:3000/index.html
   ```

---

## 📖 Usage Flow (Platform Demo)
1. **Simulation Start**: Launch the server and visit `http://localhost:3000`. 
2. **Create Account**: Open "Create Account" or use the preset Admin credentials (`admin` / `admin123`).
3. **Testing Modals**: The SQLite Database handles the Farmer, Crop, Equipment and Bid states automatically!
4. **Dashboard Action**: Dive directly into `farmer-dashboard.html` to List a Crop.
5. **Explore Bids**: Notice the backend automatically throwing a simulated wholesaler counter-bid 2.5 seconds after predicting the AI market rate of your newly listed crop.

---

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/yourusername/kisanconnect/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
