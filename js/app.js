<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống Quản lý Tuyển sinh Edutech Premium - CRM V5.0</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --p-color: #4361ee; /* Royal Blue */
            --s-color: #4cc9f0; /* Cyan Neon */
            --a-color: #f72585; /* Pink Neon */
            --dark-bg: #0b1120; /* Deep Navy */
            --card-bg: rgba(255, 255, 255, 0.9);
            --text-main: #1e293b;
            --font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            background-color: #f1f5f9;
            background-image: radial-gradient(at 10% 10%, rgba(67, 97, 238, 0.1) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(76, 201, 240, 0.15) 0px, transparent 50%);
            font-family: var(--font-family);
            color: var(--text-main);
            font-size: 14px;
            letter-spacing: -0.2px;
        }

        /* PREMIUM GLASS CARDS */
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            border: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 10px 40px rgba(0,0,0,0.03);
            padding: 25px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(67, 97, 238, 0.1);
        }

        /* SIDEBAR & FORM */
        .sidebar-panel { position: sticky; top: 20px; }
        .form-control, .form-select {
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 12px 15px;
            background: rgba(255,255,255,0.8);
        }
        .form-control:focus { border-color: var(--p-color); box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15); }
        .btn-premium {
            background: linear-gradient(135deg, var(--p-color), var(--s-color));
            color: white; border: none; border-radius: 12px;
            padding: 12px; font-weight: 700;
            transition: opacity 0.3s;
        }
        .btn-premium:hover { opacity: 0.9; color: white; }

        /* TABS NAVIGATION */
        .nav-pills .nav-link {
            border-radius: 14px;
            color: #64748b;
            font-weight: 700;
            padding: 12px 24px;
            margin-right: 8px;
            transition: all 0.3s;
        }
        .nav-pills .nav-link.active {
            background-color: var(--p-color);
            color: white;
            box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25);
        }
        .nav-pills .nav-link:not(.active):hover { background-color: rgba(67, 97, 238, 0.05); color: var(--p-color); }

        /* TABLE PREMIUM */
        .student-table-card { border: none; border-radius: 24px; background: white; box-shadow: 0 10px 40px rgba(0,0,0,0.03); overflow: hidden; }
        .table { margin-bottom: 0; }
        .table thead th {
            background: #f8fafc;
            color: #94a3b8;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
            padding: 20px;
            border: none;
        }
        .table tbody td {
            padding: 18px 20px;
            vertical-align: middle;
            border-bottom: 1px solid #f1f5f9;
            transition: background 0.2s;
        }
        .table tbody tr:last-child td { border-bottom: none; }
        .table tbody tr:hover td { background-color: #f8fafc; }

        /* AVATAR GRAPHICS */
        .avatar-circle {
            width: 44px; height: 44px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 16px; color: white;
            text-transform: uppercase;
            margin-right: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        /* PROGRESS BAR */
        .progress-premium { height: 8px; border-radius: 10px; background: #e2e8f0; overflow: hidden; }
        .progress-bar { background: linear-gradient(90deg, var(--p-color), var(--s-color)); border-radius: 10px; }

        /* UPSELL ALERT NEON */
        .upsell-row { background-color: #fff1f2 !important; position: relative; }
        .upsell-row td { color: #881337 !important; }
        .neon-tag {
            background: var(--a-color);
            color: white;
            font-weight: 800;
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 20px;
            box-shadow: 0 0 15px rgba(247, 37, 133, 0.5);
            animation: neonPulse 1.5s infinite;
        }
        @keyframes neonPulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

        /* PAGE HEADER */
        .page-header h2 { font-weight: 800; letter-spacing: -1.5px; color: var(--dark-bg); }
        .page-header p { color: #64748b; font-size: 16px; }

    </style>
</head>
<body>

<div class="container-fluid py-5 px-md-5">
    
    <div class="row page-header mb-5 align-items-center">
        <div class="col-md-8">
            <h2>Hệ thống Quản lý Học viên Premium</h2>
            <p>Điều phối, Phân tích & Nhận diện cơ hội Upsell dành cho Cán bộ Tuyển sinh</p>
        </div>
        <div class="col-md-4 text-md-end">
            <div class="d-flex justify-content-md-end gap-2">
                <input type="text" id="searchBox" class="form-control border-0 shadow-sm px-4" style="border-radius: 14px; width: 220px;" placeholder="Tìm nhanh..." onkeyup="renderTable()">
                <button class="btn btn-white shadow-sm" style="border-radius: 14px;"><i class="fa-solid fa-bell text-muted"></i></button>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-xl-3 col-lg-4 sidebar-panel">
            <div class="glass-card mb-4">
                <h6 class="fw-bold mb-4" style="color: var(--dark-bg);"><i class="fa-solid fa-bolt me-2 text-warning"></i>Ghi danh tốc độ</h6>
                <form id="addForm">
                    <div class="mb-3">
                        <label class="small fw-600 text-muted mb-1">Họ tên đầy đủ</label>
                        <input type="text" id="name" class="form-control" placeholder="Nguyễn Văn A" required>
                    </div>
                    <div class="mb-3">
                        <label class="small fw-600 text-muted mb-1">Số điện thoại</label>
                        <input type="text" id="phone" class="form-control" placeholder="09xxxx..." required>
                    </div>
                    <div class="mb-4">
                        <label class="small fw-600 text-muted mb-1">Phễu lớp học</label>
                        <select id="classSelect" class="form-select">
                            <option value="Tiếng Đức">🇩🇪 Tiếng Đức Kỹ Thuật</option>
                            <option value="Tiếng Anh">🇬🇧 Tiếng Anh Giao Tiếp</option>
                            <option value="Vibe Coding">👩‍💻 Vibe Coding (Nữ)</option>
                            <option value="Marketing">📈 Digital Marketing</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-premium w-100 fw-800">GHI DANH NGAY</button>
                </form>
            </div>
            
            <div class="glass-card text-center">
                <h6 class="fw-bold mb-3 text-start">Hiệu suất Upsell</h6>
                <div style="position: relative;">
                    <canvas id="upsellChart" style="max-height: 200px;"></canvas>
                    <div id="hotCount" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <h2 class="fw-800 m-0 text-danger">0</h2>
                        <small class="text-muted">Hot Potential</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-9 col-lg-8">
            
            <ul class="nav nav-pills mb-4" id="pills-tab">
                <li class="nav-item"><button class="nav-link active" onclick="filterClass('All')"><i class="fa-solid fa-border-all me-1"></i> Tất cả</button></li>
                <li class="nav-item"><button class="nav-link" onclick="filterClass('Tiếng Đức')">🇩🇪 Đức</button></li>
                <li class="nav-item"><button class="nav-link" onclick="filterClass('Tiếng Anh')">🇬🇧 Anh</button></li>
                <li class="nav-item"><button class="nav-link" onclick="filterClass('Vibe Coding')">👩‍💻 Coding</button></li>
                <li class="nav-item"><button class="nav-link" onclick="filterClass('Marketing')">📈 Marketing</button></li>
            </ul>

            <div class="student-table-card overflow-hidden">
                <div class="table-responsive">
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th class="px-4 py-3">Thông tin học viên</th>
                                <th>Ngành học</th>
                                <th>Lộ trình (%)</th>
                                <th>Sale Status</th>
                                <th class="text-end px-4">Thao tác</th>
                            }
                        </thead>
                        <tbody id="dataTable">
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    let currentFilter = 'All';
    const avatarColors = ['#4361ee', '#4cc9f0', '#f72585', '#3f37c9', '#ef476f'];
    
    // DỮ LIỆU DEMO PREMIUM CHI TIẾT
    const demoDataV5 = [
        { id: 1, name: "Trần Minh Đức", phone: "0912xxxx78", class: "Tiếng Đức", progress: 95, staff: "Trần Lan" },
        { id: 2, name: "Phạm Thảo Vy", phone: "0987xxxx21", class: "Vibe Coding", progress: 85, staff: "Mai Lan" },
        { id: 3, name: "Hoàng Hữu Bằng", phone: "0344xxxx99", class: "Marketing", progress: 82, staff: "Tự Do" },
        { id: 4, name: "Bùi Tuyết Nhi", phone: "0900xxxx33", class: "Tiếng Anh", progress: 88, staff: "Hoàng Yến" },
        { id: 5, name: "Ngô Quốc Anh", phone: "0333xxxx55", class: "Tiếng Đức", progress: 20, staff: "Admin" },
        { id: 6, name: "Vũ Quang Huy", phone: "0944xxxx77", class: "Marketing", progress: 65, staff: "Hữu Bằng" },
        { id: 7, name: "Lê Mỹ Linh", phone: "0911xxxx44", class: "Vibe Coding", progress: 40, staff: "Mai Lan" },
        { id: 8, name: "Đỗ Gia Bảo", phone: "0977xxxx00", class: "Tiếng Anh", progress: 15, staff: "Hoàng Yến" },
        { id: 9, name: "Nguyễn Văn Chuyển", phone: "0866xxxx33", class: "Tiếng Đức", progress: 92, staff: "Trần Lan" },
        { id: 10, name: "Hồ Công Kiên", phone: "0912xxxx11", class: "Marketing", progress: 10, staff: "Admin" }
    ];

    let students = JSON.parse(localStorage.getItem('edu_crm_v5')) || demoDataV5;
    let myChart;

    function renderTable() {
        const table = document.getElementById('dataTable');
        const search = document.getElementById('searchBox').value.toLowerCase();
        table.innerHTML = '';

        const filtered = students.filter(s => {
            const mClass = currentFilter === 'All' || s.class === currentFilter;
            const mSearch = s.name.toLowerCase().includes(search) || s.phone.includes(search);
            return mClass && mSearch;
        }).sort((a, b) => b.progress - a.progress); 

        filtered.forEach(s => {
            const isHot = s.progress >= 80;
            const initials = s.name.split(' ').map(n=>n[0]).join('').slice(0,2);
            const avatarColor = avatarColors[s.id % avatarColors.length];
            const row = document.createElement('tr');
            if(isHot) row.className = 'upsell-row';
            
            row.innerHTML = `
                <td class="px-4">
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle" style="background:${avatarColor}">${initials}</div>
                        <div>
                            <div class="fw-800 text-dark">${s.name}</div>
                            <small class="text-muted fw-600">${s.phone}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge ${s.class==='Tiếng Đức'?'bg-warning text-dark':(s.class==='Tiếng Anh'?'bg-primary':'bg-info')} bg-opacity-10 text-dark px-3 py-2 fw-600">${s.class}</span></td>
                <td style="width: 180px">
                    <div class="d-flex align-items-center">
                        <div class="progress-premium flex-grow-1 me-2"><div class="progress-bar ${isHot?'bg-danger':'bg-primary'}" style="width:${s.progress}%"></div></div>
                        <span class="fw-800 text-dark" style="font-size: 11px;">${s.progress}%</span>
                    </div>
                </td>
                <td>
                    ${isHot ? '<span class="neon-tag"><i class="fa-solid fa-fire me-1"></i> HOT UP-SELL</span>' : '<span class="text-muted small"><i class="fa-solid fa-clock me-1"></i> Nurturing</span>'}
                </td>
                <td class="text-end px-4">
                    <button class="btn btn-sm btn-light border-0 text-muted" onclick="editProgress(${s.id})" style="border-radius:10px;"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn btn-sm btn-light border-0 text-danger ms-1" onclick="remove(${s.id})" style="border-radius:10px;"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            table.appendChild(row);
        });
        updateChart();
        localStorage.setItem('edu_crm_v5', JSON.stringify(students));
    }

    function editProgress(id) {
        const s = students.find(x => x.id === id);
        const val = prompt("Cập nhật tiến độ lộ trình học (%) cho " + s.name, s.progress);
        if(val !== null && !isNaN(val)) {
            s.progress = Math.min(100, Math.max(0, parseInt(val)));
            renderTable();
        }
    }

    function filterClass(name) {
        currentFilter = name;
        document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        renderTable();
    }

    function remove(id) {
        if(confirm('Xóa học viên?')) {
            students = students.filter(s => s.id !== id);
            renderTable();
        }
    }

    function updateChart() {
        const hot = students.filter(s => s.progress >= 80).length;
        const cold = students.length - hot;
        document.querySelector('#hotCount h2').innerText = hot;

        if(myChart) myChart.destroy();
        const ctx = document.getElementById('upsellChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Cần Upsell', 'Đang học'],
                datasets: [{ data: [hot, cold], backgroundColor: ['#f72585', '#e2e8f0'], borderWidth: 0, weight: 1 }]
            },
            options: { cutout: '85%', plugins: { legend: { display: false } }, animation: { duration: 1000, easing: 'easeOutQuart' } }
        });
    }

    document.getElementById('addForm').onsubmit = (e) => {
        e.preventDefault();
        students.push({
            id: Date.now(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            class: document.getElementById('classSelect').value,
            progress: 10,
            staff: "Admin"
        });
        renderTable();
        e.target.reset();
    };

    window.onload = renderTable;
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
