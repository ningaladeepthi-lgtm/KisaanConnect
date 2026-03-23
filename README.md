# 🌿 KisanConnect 

![KisanConnect Banner](https://via.placeholder.com/1000x300.png?text=KisanConnect+-+Empowering+Farmers+and+Wholesalers)

**KisanConnect** is a modern, highly functional, B2B web platform prototype built from scratch to bridge the gap between Farmers and Agricultural Wholesalers. The platform features an advanced localized bidding system, an inventory management hub, and AI-driven market price tracking.

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
* **Dynamic State Management (No DB Required!):** The entire prototype manages state dynamically simulating a live application. User profile details, active equipment listings, and crop bids elegantly persist via the browser's native `localStorage`.
* **Multi-Language Engine:** A functional i18n dynamic translation module converting core navigation elements instantly between **English**, **Hindi**, and **Telugu**.

---

## 💻 Tech Stack

KisanConnect is a blazingly fast frontend prototype built flawlessly without heavy overhead frameworks.
* **Core Structure:** Semantic `HTML5`
* **Design & Animations:** Custom `CSS3` (Flexbox, Grid, CSS Variables, Keyframes)
* **Application Logic:** Vanilla `JavaScript` (ES6+)
* **Data Persistence:** DOM manipulation synchronized with Web `LocalStorage API`
* **Typography:** `Google Fonts` (Inter)

---

## 🚀 How to Run Locally

You do not need a complex Node.js or Python backend server to run this application.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/kisanconnect.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd kisanconnect
   ```
3. **Launch the platform:**
   Simply double-click on `index.html` to open it in any modern web browser.
   *(Alternatively, run it via a tool like VSCode Live Server for live-reloading!)*

---

## 📖 Usage Flow (Prototype Demo)
1. **Simulation Start**: Click `index.html`. 
2. **Create Account**: Switch to "Create Account", type your name (e.g. `Ammu`), and select **Farmer**.
3. **Login Engine**: Once registered, login using your phone number or UPI.
4. **Dashboard**: The prototype will actively retrieve your identity from local storage and render your name directly into the sidebar profile panel natively!
5. **Explore**: Navigate to `My Crops`, test the `AI Price Suggestion Meter`, or list a tractor in the `Equipment Hub`!

---

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/yourusername/kisanconnect/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
