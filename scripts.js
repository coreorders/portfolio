// Basic script for any potential interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log("Coreorders Portfolio Loaded");

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return; // Ignore empty or # links (like Site Info initially)

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modal Logic
    const modal = document.getElementById("patch-notes-modal");
    const siteInfoLink = document.getElementById("site-info-link");
    const closeBtn = document.getElementsByClassName("close-modal")[0];
    const patchNotesBody = document.getElementById("patch-notes-body");

    siteInfoLink.onclick = function (e) {
        e.preventDefault();
        modal.style.display = "block";
        loadPatchNotes();
    }

    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Fetch Patch Notes
    async function loadPatchNotes() {
        try {
            const response = await fetch('PATCH_NOTES.md');
            if (response.ok) {
                const text = await response.text();
                // Simple text protection to safe HTML or just pre-wrap
                patchNotesBody.textContent = text;
            } else {
                patchNotesBody.textContent = "패치 노트를 불러올 수 없습니다.";
            }
        } catch (error) {
            console.error('Error fetching patch notes:', error);
            patchNotesBody.textContent = "패치 노트 로드 중 오류가 발생했습니다. (로컬 환경에서는 브라우저 보안 정책으로 인해 보이지 않을 수 있습니다)";
        }
    }

    // GitHub Last Update Fetcher
    async function fetchGitHubUpdates() {
        const updateElements = document.querySelectorAll('.update-date');
        const username = 'coreorders';

        updateElements.forEach(async (element) => {
            const repo = element.getAttribute('data-repo');
            if (!repo) return;

            try {
                // Fetch repository info to get 'pushed_at'
                const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
                if (response.ok) {
                    const data = await response.json();
                    const lastUpdate = new Date(data.pushed_at);
                    // Format date as YYYY.MM.DD
                    const formattedDate = lastUpdate.getFullYear() + '.' +
                        String(lastUpdate.getMonth() + 1).padStart(2, '0') + '.' +
                        String(lastUpdate.getDate()).padStart(2, '0');
                    element.textContent = `Last Update: ${formattedDate}`;
                } else {
                    element.textContent = 'Last Update: -';
                }
            } catch (error) {
                console.error(`Error fetching update for ${repo}:`, error);
                element.textContent = 'Last Update: -';
            }
        });
    }

    fetchGitHubUpdates();
});
