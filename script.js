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

    // [추가] 닉네임 관련 요소
    const showNicknameCheckbox = document.getElementById('showNickname');
    const nicknameInput = document.getElementById('nicknameInput');

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
        });
    });

    // 8. 그림으로 저장 기능
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        // 닉네임 표시 여부와 값 가져오기
        const isShowNickname = showNicknameCheckbox.checked;
        const nickname = nicknameInput.value.trim();

        // 해상도 설정
        const selectedResolution = resolutionSelect.value;
        let targetWidth;
        if (selectedResolution === '4K') {
            targetWidth = 3840;
        } else {
            targetWidth = 1920;
        }
        const scale = targetWidth / 1920;
        const backgroundColor = window.getComputedStyle(body).backgroundColor;

        // 캡처 준비
        checklist.classList.add('saving-mode');
        const wasUIVisible = settingsUI.classList.contains('visible');
        settingsUI.classList.remove('visible');
        openSettingsButton.style.display = 'none';

        // 캡처할 대상 요소 (기본값: 체크리스트)
        let captureTarget = checklist;
        let tempWrapper = null;

        // 닉네임 표시가 활성화되고 닉네임이 입력되었을 경우
        if (isShowNickname && nickname) {
            // 제목으로 사용할 div 생성
            const titleElement = document.createElement('div');
            titleElement.textContent = `${nickname} 보유팩`;
            // 제목 스타일링
            Object.assign(titleElement.style, {
                width: '1920px',
                height: '65px',
                padding: '15px 0',
                textAlign: 'center',
                fontSize: '48px',
                fontWeight: 'none',
                color: window.getComputedStyle(body).color,
                boxSizing: 'border-box'
            });

            // 캡처를 위해 제목과 체크리스트를 감싸는 임시 래퍼 생성
            tempWrapper = document.createElement('div');
            checklist.parentNode.insertBefore(tempWrapper, checklist); // 래퍼를 체크리스트 앞에 삽입
            tempWrapper.appendChild(titleElement); // 제목을 래퍼에 추가
            tempWrapper.appendChild(checklist); // 체크리스트를 래퍼 안으로 이동
            captureTarget = tempWrapper; // 캡처 대상을 임시 래퍼로 변경
        }

        html2canvas(captureTarget, {
            scale: scale,
            backgroundColor: backgroundColor,
            useCORS: true,
            width: 1920
        }).then(canvas => {
            const imageURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageURL;
            
            if (isShowNickname && nickname) {
                link.download = `${nickname}보유팩.png`;
            } else {
                link.download = `sims4_dlc_checklist_${selectedResolution}.png`;
            }
            link.click();
        }).catch(err => {
            console.error("이미지 저장 중 오류 발생:", err);
        }).finally(() => {
            // 캡처 후 정리 작업
            checklist.classList.remove('saving-mode');
            if (wasUIVisible) {
                settingsUI.classList.add('visible'); 
            }
            openSettingsButton.style.display = 'block';

            // 임시로 추가했던 래퍼가 있다면, 체크리스트를 원래 위치로 복원하고 래퍼를 제거
            if (tempWrapper) {
                tempWrapper.parentNode.insertBefore(checklist, tempWrapper);
                tempWrapper.remove();
            }
        });
    });

});