document.addEventListener('DOMContentLoaded', () => {

    // ========== [UI 요소 선택] ==========
    const settingsUI = document.querySelector('.game-options-container');
    const openSettingsButton = document.getElementById('openSettingsButton');
    const closeSettingsButton = document.querySelector('.close-button');

    const menuItems = document.querySelectorAll('.menu-item');
    const settingsSections = document.querySelectorAll('.settings-section');

    // [수정] 버튼으로 변경됨
    const selectAllButton = document.getElementById('selectAllButton');
    const deselectAllButton = document.getElementById('deselectAllButton');
    
    // [유지] 체크박스와 리스트
    const showPackNamesCheckbox = document.getElementById('showPackNames');
    const themeSelect = document.getElementById('themeSelect');
    
    // 기존 요소
    const dlcItems = document.querySelectorAll('.dlc-item');
    const saveButton = document.getElementById('saveButton');
    const resolutionSelect = document.getElementById('resolution');
    const checklist = document.getElementById('dlc-checklist');
    const body = document.body;

    // ================== [초기 상태 설정] ==================
    body.classList.add('show-names');
    showPackNamesCheckbox.checked = true; // 체크박스 상태 동기화
    
    dlcItems.forEach(item => {
        item.classList.add('selected');
    });


    // ================== [UI 기능] ==================
    
    // 1. 설정 메뉴 열기/닫기
    openSettingsButton.addEventListener('click', () => {
        settingsUI.classList.add('visible');
    });
    closeSettingsButton.addEventListener('click', () => {
        settingsUI.classList.remove('visible');
    });

    // 2. 메뉴 탭 전환 기능
    menuItems.forEach(menu => {
        menu.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove('active'));
            settingsSections.forEach(sec => sec.classList.remove('active'));

            menu.classList.add('active');
            const targetSectionId = menu.id.replace('Menu', 'Settings');
            document.getElementById(targetSectionId).classList.add('active');
        });
    });

    // ================== [기능 연결] ==================

    // 3. 팩 이름 표시/숨김 (체크박스)
    showPackNamesCheckbox.addEventListener('change', () => {
        if (showPackNamesCheckbox.checked) {
            body.classList.add('show-names');
        } else {
            body.classList.remove('show-names');
        }
    });

    // 4. 배경 테마 변경 (리스트)
    themeSelect.addEventListener('change', () => {
        if (themeSelect.value === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    });

    // 5. 모두 선택 기능 (버튼으로 수정)
    selectAllButton.addEventListener('click', () => {
        dlcItems.forEach(item => {
            item.classList.add('selected');
        });
    });

    // 6. 모두 해제 기능 (버튼으로 수정)
    deselectAllButton.addEventListener('click', () => {
        dlcItems.forEach(item => {
            item.classList.remove('selected');
        });
    });

    // 7. 아이콘 개별 선택/해제 기능
    dlcItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            // [수정] 체크박스 관련 코드 삭제
        });
    });

    // 8. 그림으로 저장 기능 (수정 없음)
    saveButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        const selectedResolution = resolutionSelect.value;
        let targetWidth;

        if (selectedResolution === '4K') {
            targetWidth = 3840;
        } else { // FHD
            targetWidth = 1920;
        }

        const scale = targetWidth / 1920; 
        const backgroundColor = window.getComputedStyle(body).backgroundColor;

        checklist.classList.add('saving-mode');

        settingsUI.style.display = 'none'; 
        openSettingsButton.style.display = 'none';

        html2canvas(checklist, {
            scale: scale,
            backgroundColor: backgroundColor,
            useCORS: true,
            width: 1920
        })
        .then(canvas => {
            const imageURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `sims4_dlc_checklist_${selectedResolution}.png`;
            link.click();
        })
        .catch(err => {
            console.error("이미지 저장 중 오류 발생:", err);
        })
        .finally(() => {
            checklist.classList.remove('saving-mode');
            
            if (settingsUI.classList.contains('visible')) {
                settingsUI.style.display = 'flex'; 
            } else {
                settingsUI.style.display = 'none'; 
            }
            openSettingsButton.style.display = 'block';
        });
    });

});