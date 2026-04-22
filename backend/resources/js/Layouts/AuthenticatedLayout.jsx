import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, children }) {
    const { url } = usePage();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isOwner = user?.role === 'owner';

    const navLinks = [
        { href: route('dashboard'), label: 'Beranda', icon: '🏠' },
        { href: route('dashboardkeuangan'), label: 'Keuangan', icon: '💵'},
        ...(isOwner ? [{ href: route('audit.index'), label: 'Audit Log', icon: '🔐' }] : []),
    ];

    // PERBAIKAN 1: Logika Active Link yang lebih aman
    const isActive = (href) => {
    try {
        const path = new URL(href).pathname;
        // Jika link adalah beranda/dashboard utama, gunakan perbandingan persis (exact match)
        if (path === '/dashboard') {
            return url === path;
        }
        // Untuk menu lain, gunakan startsWith agar sub-menu tetap terhitung aktif
        return url.startsWith(path);
    } catch (e) {
        return false;
    }
};

    // PERBAIKAN 2: Klik di luar untuk menutup dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600&display=swap');

                .nav-root {
                    background: #fff;
                    border-bottom: 1px solid #e0e0e0;
                    position: sticky; top: 0; z-index: 50;
                    box-shadow: 0 1px 3px rgba(0,0,0,.06);
                }
                .nav-inner {
                    max-width: 1400px; margin: 0 auto;
                    padding: 0 20px;
                    display: flex; align-items: center;
                    height: 56px;
                }
                .nav-logo {
                    display: flex; align-items: center; gap: 10px;
                    margin-right: 28px; text-decoration: none;
                    color: #202124;
                }
                .nav-logo-icon {
                    width: 32px; height: 32px;
                    background: linear-gradient(135deg, #e81a69, #a10d6b);
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 16px; font-weight: 700;
                }
                .nav-logo-text {
                    font-size: 15px; font-weight: 600;
                    color: #202124; letter-spacing: -.3px;
                }
                .nav-links {
                    display: flex; align-items: center; gap: 2px;
                    flex: 1;
                }
                .nav-link {
                    display: flex; align-items: center; gap: 6px;
                    padding: 6px 14px; border-radius: 6px;
                    font-size: 13.5px; font-weight: 500;
                    color: #5f6368; text-decoration: none;
                    transition: background .15s, color .15s;
                    white-space: nowrap;
                    position: relative;
                }
                .nav-link:hover { background: #f1f3f4; color: #202124; }
                .nav-link.active {
                    color: #1a73e8;
                    background: #e8f0fe;
                }
                .nav-link.active::after {
                    content: '';
                    position: absolute; bottom: -10px; left: 14px; right: 14px;
                    height: 2px; background: #1a73e8; border-radius: 2px 2px 0 0;
                }
                .nav-link-icon { font-size: 14px; }

                .nav-user {
                    margin-left: auto;
                    position: relative;
                }
                .nav-user-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 6px 12px; border-radius: 20px;
                    border: 1px solid #e0e0e0;
                    background: #fff; cursor: pointer;
                    font-size: 13px; font-weight: 500; color: #202124;
                    font-family: inherit;
                    transition: background .15s, border-color .15s;
                }
                .nav-user-btn:hover { background: #f1f3f4; border-color: #bdc1c6; }
                .nav-avatar {
                    width: 26px; height: 26px; border-radius: 50%;
                    background: linear-gradient(135deg, #1a73e8, #0d47a1);
                    color: #fff; font-size: 11px; font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                }
                .nav-role-badge {
                    font-size: 10px; font-weight: 600;
                    padding: 1px 6px; border-radius: 8px;
                    background: ${isOwner ? '#fce8b2' : '#e8f0fe'};
                    color: ${isOwner ? '#b06000' : '#1a73e8'};
                    text-transform: uppercase; letter-spacing: .4px;
                }

                .nav-dropdown {
                    position: absolute; right: 0; top: calc(100% + 8px);
                    background: #fff; border: 1px solid #e0e0e0;
                    border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.12);
                    min-width: 200px; overflow: hidden;
                    animation: dropIn .12s ease;
                }
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .nav-dropdown-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid #f1f3f4;
                    background: #fafafa;
                }
                .nav-dropdown-name { font-size: 13px; font-weight: 600; color: #202124; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .nav-dropdown-email { font-size: 11px; color: #80868b; margin-top: 1px; }
                .nav-dropdown-item {
                    display: block; width: 100%;
                    padding: 10px 16px; text-align: left;
                    background: none; border: none; cursor: pointer;
                    font-size: 13px; color: #3c4043; font-family: inherit;
                    text-decoration: none;
                    transition: background .1s;
                }
                .nav-dropdown-item:hover { background: #f1f3f4; }
                .nav-dropdown-item.danger { color: #d93025; border-top: 1px solid #f1f3f4; }
                .nav-dropdown-item.danger:hover { background: #fce8e6; }

                .page-content {
                    max-width: 1400px; margin: 0 auto;
                    padding: 24px 20px;
                }
            `}</style>

            <nav className="nav-root">
                <div className="nav-inner">
                    {/* PERBAIKAN 3: Gunakan <Link> untuk SPA Navigation, bukan <a> */}
                    <Link href={route('dashboard')} className="nav-logo">
                        <div className="nav-logo-icon">Q</div>
                        <span className="nav-logo-text">Queenput</span>
                    </Link>

                    <div className="nav-links">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                            >
                                <span className="nav-link-icon">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="nav-user" ref={dropdownRef}>
                        <button
                            className="nav-user-btn"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                        >
                            <div className="nav-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{user?.name?.split(' ')[0]}</span>
                            <span className="nav-role-badge">{user?.role ?? 'admin'}</span>
                            <span style={{ fontSize: 10, color: '#80868b' }}>▾</span>
                        </button>

                        {dropdownOpen && (
                            <div className="nav-dropdown">
                                <div className="nav-dropdown-header">
                                    <div className="nav-dropdown-name">{user?.name}</div>
                                    <div className="nav-dropdown-email">{user?.email}</div>
                                </div>
                                <Link href={route('profile.edit')} className="nav-dropdown-item">
                                    ⚙️ &nbsp;Edit Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="nav-dropdown-item danger"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    🚪 &nbsp;Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="page-content">
                {children}
            </main>
        </div>
    );
}