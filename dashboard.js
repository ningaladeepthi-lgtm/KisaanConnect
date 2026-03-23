document.addEventListener('DOMContentLoaded', () => {

    // 0. Load Logged-in User
    let currentUser = JSON.parse(localStorage.getItem('kisan_user'));
    if (!currentUser) {
        currentUser = { name: "Ramesh Kumar", location: "Pune", category: "farmer", phone: "9876543210" };
        localStorage.setItem('kisan_user', JSON.stringify(currentUser));
    }
    
    // Update User Profile UI
    const nameEl = document.getElementById('user-display-name');
    const locEl = document.getElementById('user-display-location');
    const avEl = document.getElementById('user-avatar-initial');
    if (nameEl && locEl && avEl) {
        nameEl.textContent = currentUser.name;
        locEl.textContent = currentUser.location;
        avEl.textContent = currentUser.name.charAt(0).toUpperCase();
    }

    // 1. Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked target
            item.classList.add('active');

            // Hide all views
            viewSections.forEach(view => view.classList.remove('active'));

            // Show selected view
            const targetId = item.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }

            // Update Page Title and Subtitle dynamically
            const pageTitle = document.getElementById('page-title');
            const pageSubtitle = document.getElementById('page-subtitle');
            
            if (targetId === 'crops-view') {
                pageTitle.textContent = 'My Crops';
                pageSubtitle.textContent = 'Manage your listings, bids, and get AI price estimates.';
            } else if (targetId === 'equipment-view') {
                pageTitle.textContent = 'Equipment Hub';
                pageSubtitle.textContent = 'Rent machinery, view availability, and manage your inventory.';
            } else if (targetId === 'payment-view') {
                pageTitle.textContent = 'Payment System';
                pageSubtitle.textContent = 'Track your revenue, pending payments, and transactions.';
            } else if (targetId === 'crop-listings-view') {
                pageTitle.textContent = 'Crop Listings';
                pageSubtitle.textContent = 'Browse available crops, apply filters, and find the best deals.';
            } else if (targetId === 'bidding-view') {
                pageTitle.textContent = 'Browse & Bid';
                pageSubtitle.textContent = 'View your active bids, price trends, and contact farmers.';
            }
        });
    });

    // 2. Inner Tabs (e.g., Equipment Browse vs My Equipment)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const subViews = document.querySelectorAll('.sub-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find parent tabs container to scope active states
            const parentTabs = btn.closest('.tabs');
            parentTabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Find parent view to scope sub-views
            const parentView = btn.closest('.view-section');
            parentView.querySelectorAll('.sub-view').forEach(sv => sv.classList.add('hidden'));

            const targetTabId = btn.getAttribute('data-tab');
            const targetSubView = document.getElementById(targetTabId);
            if (targetSubView) {
                targetSubView.classList.remove('hidden');
            }
        });
    });

    // 3. AI Price Meter & Add Crop Form (Farmer Portal)
    const addCropForm = document.getElementById('add-crop-form');
    if (addCropForm) {
        const cropType = document.getElementById('crop-type');
        const cropPrice = document.getElementById('crop-price');
        const aiResult = document.getElementById('ai-price-result');
        const aiIcon = document.getElementById('ai-icon');
        const aiText = document.getElementById('ai-text');

        // Market Dataset
        const marketPrices = {
            'Wheat': 2100,
            'Soybean': 4600,
            'Cotton': 7200,
            'Rice': 3000,
            'Onion': 1800
        };

        const evaluatePrice = () => {
            const typeValue = cropType.value;
            const priceValue = parseFloat(cropPrice.value);

            if (!typeValue || isNaN(priceValue)) {
                aiResult.classList.add('hidden');
                return;
            }

            const marketPrice = marketPrices[typeValue];
            if (!marketPrice) return; // If crop not in dict

            const tenPercent = marketPrice * 0.10;
            const lowerBound = marketPrice - tenPercent;
            const upperBound = marketPrice + tenPercent;

            aiResult.classList.remove('hidden');

            if (priceValue < lowerBound) {
                aiResult.style.backgroundColor = '#FEF2F2';
                aiResult.style.color = '#B91C1C';
                aiIcon.textContent = '📉';
                aiText.textContent = `Low Price. Avg market is ₹${marketPrice}/Qtl. Consider increasing slightly.`;
            } else if (priceValue > upperBound) {
                aiResult.style.backgroundColor = '#FFFBEB';
                aiResult.style.color = '#B45309';
                aiIcon.textContent = '⚠️';
                aiText.textContent = `High Price. Avg market is ₹${marketPrice}/Qtl. May attract fewer bids.`;
            } else {
                aiResult.style.backgroundColor = '#ECFDF5';
                aiResult.style.color = '#047857';
                aiIcon.textContent = '✅';
                aiText.textContent = `Good Price! Competitive with the market average of ₹${marketPrice}/Qtl.`;
            }
        };

        cropType.addEventListener('change', evaluatePrice);
        cropPrice.addEventListener('input', evaluatePrice);

        addCropForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const quality = document.getElementById('crop-quality').value;
            const qty = parseInt(document.getElementById('crop-qty').value);
            const price = parseFloat(cropPrice.value);
            const type = cropType.value;

            if (!type || isNaN(qty) || isNaN(price) || !quality) {
                alert("Please fill in all details with valid numbers.");
                return;
            }

            if (qty <= 0 || price <= 0) {
                alert("Quantity and Expected Price must be greater than zero.");
                return;
            }

            const crops = JSON.parse(localStorage.getItem('kisan_crops') || '[]');
            const newCrop = {
                id: Date.now(),
                type: type,
                quantity: qty,
                price: price,
                quality: quality,
                location: currentUser.location, 
                seller: currentUser.name, 
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            crops.unshift(newCrop);
            localStorage.setItem('kisan_crops', JSON.stringify(crops));
            
            alert('Crop Listed Successfully!');
            addCropForm.reset();
            aiResult.classList.add('hidden');
            renderFarmerCrops();
        });

        // Initial Render
        renderFarmerCrops();
    }

    // 4. Wholesaler Portal (Filters & Rendering)
    const wsGrid = document.getElementById('wholesaler-crops-grid');
    if (wsGrid) {
        const searchInput = document.getElementById('ws-search');
        const locationSelect = document.getElementById('ws-location');
        const typeSelect = document.getElementById('ws-type');
        const filterBtn = document.getElementById('ws-filter-btn');

        window.filterAndRender = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const locationTerm = locationSelect ? locationSelect.value : '';
            const typeTerm = typeSelect ? typeSelect.value : '';

            const crops = JSON.parse(localStorage.getItem('kisan_crops') || '[]');

            const filteredCrops = crops.filter(c => {
                const matchesSearch = c.seller.toLowerCase().includes(searchTerm) || c.type.toLowerCase().includes(searchTerm);
                const matchesLoc = locationTerm === '' || c.location === locationTerm;
                const matchesType = typeTerm === '' || c.type === typeTerm;
                return matchesSearch && matchesLoc && matchesType;
            });

            if (filteredCrops.length === 0) {
                wsGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No crops match your filters.</p>';
                return;
            }

            wsGrid.innerHTML = filteredCrops.map(c => `
                <div class="listing-card fade-in">
                    <div class="listing-header">
                        <span class="badge badge-success">Verified Farmer</span>
                        <span>Location: ${c.location}</span>
                    </div>
                    <h3>${c.quality} ${c.type}</h3>
                    <p class="listing-details">${c.quantity} Quintals • Asking: ₹${c.price}/Qtl</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; margin-top: 0.25rem;">Seller: ${c.seller}</p>
                    
                    <div class="actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="openBidModal('${c.quality} ${c.type}', '₹${c.price}/Qtl')">Place Bid</button>
                        <button class="btn btn-outline" style="flex: 1;" onclick="alert('Starting call with ${c.seller}...')">📞 Contact</button>
                    </div>
                </div>
            `).join('');
        };

        if (filterBtn) {
            filterBtn.addEventListener('click', filterAndRender);
        }

        // Initial render
        filterAndRender();
    }

    // 5. Equipment Hub Logic
    const initEquipmentData = () => {
        if (!localStorage.getItem('kisan_equipment')) {
            const defaultEq = [
                { id: 1, name: 'Mahindra Tractor 575 DI', category: 'Tractor', rate: 800, notes: 'With Driver', location: 'Vijayawada', owner: 'Suresh P.' },
                { id: 2, name: 'Multi-speed Rotavator', category: 'Other Implement', rate: 300, notes: 'Implement Only', location: 'Warangal', owner: 'Ramesh K.' },
                { id: 3, name: 'Swaraj 744 FE Tractor', category: 'Tractor', rate: 750, notes: 'Currently Booked', location: 'Guntur', owner: 'Amit D.' }
            ];
            localStorage.setItem('kisan_equipment', JSON.stringify(defaultEq));
        }
    };
    initEquipmentData();

    const eqGrid = document.getElementById('equipment-browse-grid');
    if (eqGrid) {
        const eqSearchInput = document.querySelector('#eq-browse input[type="text"]');
        const eqVillageSelect = document.getElementById('eq-search-village');
        const eqSearchBtn = document.getElementById('eq-search-btn');

        window.renderEquipmentBrowse = () => {
            const equipment = JSON.parse(localStorage.getItem('kisan_equipment') || '[]');
            const searchTerm = eqSearchInput ? eqSearchInput.value.toLowerCase() : '';
            const villageTerm = eqVillageSelect ? eqVillageSelect.value : '';

            const filteredEq = equipment.filter(e => {
                const matchesSearch = e.name.toLowerCase().includes(searchTerm) || e.category.toLowerCase().includes(searchTerm);
                const matchesVillage = villageTerm === '' || e.location === villageTerm;
                return matchesSearch && matchesVillage;
            });

            if (filteredEq.length === 0) {
                eqGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No equipment matches your search in this area.</p>';
                return;
            }

            eqGrid.innerHTML = filteredEq.map(e => `
                <div class="listing-card">
                    <div class="listing-header">
                        <span class="badge badge-success" style="background: #dcfce7; color: #166534;">Available</span>
                        <span>📍 ${e.location}</span>
                    </div>
                    <h3 style="margin: 0.5rem 0;">${e.name}</h3>
                    <p class="listing-details" style="color: var(--text-muted); margin-bottom: 0.25rem;">₹${e.rate}/Hour • Owner: ${e.owner}</p>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Note: ${e.notes || 'None'}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary w-100" onclick="openBookingModal('${e.name}')">Book Now</button>
                        <button class="btn btn-outline" onclick="switchEqTab('eq-calendar', document.querySelectorAll('.eq-btn')[3])" title="Check Calendar">📅</button>
                    </div>
                </div>
            `).join('');
        };

        if (eqSearchBtn) {
            eqSearchBtn.addEventListener('click', renderEquipmentBrowse);
        }
        if (eqVillageSelect) {
            eqVillageSelect.addEventListener('change', renderEquipmentBrowse);
        }
        
        renderEquipmentBrowse();

        // Add Equipment Form
        const listEqForm = document.getElementById('list-equipment-form');
        if (listEqForm) {
            listEqForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('eq-name').value.trim();
                const cat = document.getElementById('eq-category').value;
                const rate = parseInt(document.getElementById('eq-rate').value);
                const notes = document.getElementById('eq-notes').value.trim();

                if (!name || name.length < 3) {
                    alert("Equipment name must be at least 3 characters.");
                    return;
                }
                if (!cat) {
                    alert("Please select a category.");
                    return;
                }
                if (isNaN(rate) || rate <= 0) {
                    alert("Please enter a valid rental rate.");
                    return;
                }

                const equipmentList = JSON.parse(localStorage.getItem('kisan_equipment') || '[]');
                equipmentList.unshift({
                    id: Date.now(),
                    name: name,
                    category: cat,
                    rate: rate,
                    notes: notes,
                    location: currentUser.location,
                    owner: currentUser.name
                });
                
                localStorage.setItem('kisan_equipment', JSON.stringify(equipmentList));
                
                alert('Equipment Listed Successfully!');
                listEqForm.reset();
                renderEquipmentBrowse();
                switchEqTab('eq-browse', document.querySelectorAll('.eq-btn')[0]);
            });
        }
    }
});

// My Crops Sub-tabs Logic
window.switchCropTab = function(tabId, btnElement) {
    document.querySelectorAll('.crop-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.crops-tabs .tab-btn').forEach(b => {
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-muted)';
        b.style.fontWeight = '500';
        b.style.marginBottom = '0';
    });
    
    document.getElementById(tabId).style.display = 'block';
    
    if(btnElement) {
        btnElement.style.borderBottom = '2px solid var(--primary)';
        btnElement.style.color = 'var(--primary)';
        btnElement.style.fontWeight = '600';
        btnElement.style.marginBottom = '-2px';
    }
    
    if (tabId === 'tab-wholesaler-bids') renderMockBids();
    if (tabId === 'tab-list-crop') renderFarmerCrops();
};

// Equipment Sub-tabs Logic
window.switchEqTab = function(tabId, btnElement) {
    document.querySelectorAll('.eq-tab-content').forEach(el => {
        el.style.display = 'none';
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.equipment-tabs .eq-btn').forEach(b => {
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-muted)';
        b.style.fontWeight = '500';
        b.style.marginBottom = '0';
    });
    
    const targetEl = document.getElementById(tabId);
    if(targetEl) {
        targetEl.style.display = 'block';
        targetEl.classList.remove('hidden');
    }
    
    if(btnElement) {
        btnElement.style.borderBottom = '2px solid var(--primary)';
        btnElement.style.color = 'var(--primary)';
        btnElement.style.fontWeight = '600';
        btnElement.style.marginBottom = '-2px';
    }
};

// Payment Sub-tabs Logic
window.switchPaymentTab = function(tabId, btnElement) {
    document.querySelectorAll('.pay-tab-content').forEach(el => {
        el.style.display = 'none';
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.payment-tabs .pay-btn').forEach(b => {
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-muted)';
        b.style.fontWeight = '500';
        b.style.marginBottom = '0';
    });
    
    const targetEl = document.getElementById(tabId);
    if(targetEl) {
        targetEl.style.display = 'block';
        targetEl.classList.remove('hidden');
    }
    
    if(btnElement) {
        btnElement.style.borderBottom = '2px solid var(--primary)';
        btnElement.style.color = 'var(--primary)';
        btnElement.style.fontWeight = '600';
        btnElement.style.marginBottom = '-2px';
    }
};

// Wholesaler Bidding Sub-tabs Logic
window.switchBiddingTab = function(tabId, btnElement) {
    document.querySelectorAll('.bid-tab-content').forEach(el => {
        el.style.display = 'none';
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.bid-tabs .bid-btn').forEach(b => {
        b.style.borderBottom = 'none';
        b.style.color = 'var(--text-muted)';
        b.style.fontWeight = '500';
        b.style.marginBottom = '0';
    });
    
    const targetEl = document.getElementById(tabId);
    if(targetEl) {
        targetEl.style.display = 'block';
        targetEl.classList.remove('hidden');
    }
    
    if(btnElement) {
        btnElement.style.borderBottom = '2px solid var(--primary)';
        btnElement.style.color = 'var(--primary)';
        btnElement.style.fontWeight = '600';
        btnElement.style.marginBottom = '-2px';
    }
};

// Payment QR Logic
window.generateQR = function() {
    const upiId = document.getElementById('upi-input').value.trim();
    if (!upiId) {
        alert("Please enter a valid UPI ID or Phone Number");
        return;
    }
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=KisanConnectUser`;
    
    document.getElementById('qr-code-img').src = qrUrl;
    document.getElementById('qr-upi-text').textContent = upiId;
    document.getElementById('qr-display-area').style.display = 'block';
};

// Price Suggestion Logic
window.calculatePriceSuggestion = function() {
    const crop = document.getElementById('suggestion-crop').value;
    const box = document.getElementById('suggestion-result-box');
    if (!crop) {
        box.style.display = 'none';
        return;
    }
    const marketPrices = {
        'Wheat': 2100,
        'Soybean': 4600,
        'Cotton': 7200,
        'Rice': 3000,
        'Onion': 1800
    };
    const market = marketPrices[crop];
    if (market) {
        const suggested = Math.round(market * 0.933); 
        document.getElementById('sugg-market-price').innerText = `Current Market Price: ₹${market}/Qtl`;
        document.getElementById('sugg-optimal-price').innerText = `Suggested Price: ~₹${suggested}/Qtl`;
        box.style.display = 'block';
    }
};

// Render Mock Bids
window.renderMockBids = function() {
    const bidsGrid = document.getElementById('bids-grid');
    if (!bidsGrid) return;
    const crops = JSON.parse(localStorage.getItem('kisan_crops') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('kisan_user')) || {name: 'Ramesh Kumar'};
    let myCrops = crops.filter(c => c.seller === currentUser.name || c.seller === 'Ramesh Kumar');
    
    if (myCrops.length === 0) {
        bidsGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">You have no active crops for wholesalers to bid on. List a crop first!</p>';
        return;
    }
    
    let bidsHTML = '';
    myCrops.forEach((c) => {
        const fluctuate = Math.floor(Math.random() * 80);
        const bidPrice = parseInt(c.price) - fluctuate;
        
        bidsHTML += `
            <div class="listing-card fade-in" style="border-left: 4px solid var(--warning);">
                <div class="listing-header">
                    <span class="badge badge-warning" style="background: rgba(245, 127, 23, 0.1); color: #f57f17;">Pending Bid</span>
                    <span>Received: Just now</span>
                </div>
                <h3>${c.quality} ${c.type}</h3>
                <p class="listing-details">Requested: ${c.quantity} Qtl • Your Price: ₹${c.price}/Qtl</p>
                <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 1rem; border-radius: var(--radius-sm); margin: 1rem 0;">
                    <p style="margin: 0; font-size: 0.9rem; color: #8d6e63;"><strong>National Traders</strong> offered:</p>
                    <h2 style="margin: 0.25rem 0 0 0; color: #f57f17;">₹${bidPrice}/Qtl</h2>
                </div>
                <div class="actions" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-success-sm" style="flex: 1; padding: 0.5rem; background: var(--success); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;" onclick="alert('Bid Accepted! Contacting Wholesaler...')">Accept Bid</button>
                    <button class="btn btn-danger-sm" style="flex: 1; padding: 0.5rem; background: var(--danger); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;" onclick="event.target.closest('.listing-card').remove(); alert('Bid declined.');">Decline</button>
                </div>
            </div>
        `;
    });
    bidsGrid.innerHTML = bidsHTML;
};
// Helper: Render Farmer Crops
function renderFarmerCrops() {
    const grid = document.getElementById('farmer-crops-grid');
    if (!grid) return;

    const crops = JSON.parse(localStorage.getItem('kisan_crops') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('kisan_user')) || {name: 'Ramesh Kumar'};
    let myCrops = crops.filter(c => c.seller === currentUser.name || c.seller === 'Ramesh Kumar');

    if (myCrops.length === 0) {
        grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No crops listed yet. Add a crop above.</p>';
        return;
    }

    grid.innerHTML = myCrops.map(c => `
        <div class="listing-card fade-in">
            <div class="listing-header">
                <span class="badge badge-success">Active</span>
                <span class="listing-date">Listed: ${c.date || 'Recently'}</span>
            </div>
            <h3>${c.quality} ${c.type}</h3>
            <p class="listing-details">${c.quantity} Quintals • ₹${c.price}/Qtl</p>
            <div class="divider"></div>
            <div class="bids-section">
                <h4>Status</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Waiting for bids...</p>
            </div>
        </div>
    `).join('');
}

// 4. Booking Modal Logic (Global functions so onclick works)
function openBookingModal(equipmentName) {
    const modal = document.getElementById('booking-modal');
    const modalTitle = document.getElementById('modal-equipment-name');
    
    if (modal && modalTitle) {
        modalTitle.textContent = `Book: ${equipmentName}`;
        modal.classList.remove('hidden');
        modal.style.display = 'flex'; // override if needed
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function submitBooking() {
    const start = document.getElementById('booking-start').value;
    const end = document.getElementById('booking-end').value;
    const payment = document.getElementById('booking-payment').value;

    if (!start || !end) {
        alert("Please select start and end dates.");
        return;
    }
    
    // Simulate UI feedback: Pending -> Paid loop
    const btn = document.querySelector('#booking-modal .btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = 'Payment Pending...';
        btn.style.background = '#F59E0B'; // yellow/orange

        setTimeout(() => {
            btn.textContent = 'Booking Confirmed (Paid)';
            btn.style.background = '#10B981'; // green

            setTimeout(() => {
                alert("Equipment Booked Successfully!");
                closeBookingModal();
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = ''; // reset
            }, 1000);
        }, 1500);
    }, 1000);
}
