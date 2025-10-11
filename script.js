const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const switchCameraButton = document.getElementById('switch-camera-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');

let currentStream;
let currentFacingMode = 'user'; // 시작을 전면 카메라('user')로 설정

// 카메라 시작 및 전환 함수
async function startCamera() {
    try {
        // 기존 스트림이 있으면 중지
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        // 현재 facingMode에 따라 카메라 요청
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentFacingMode
            }
        });

        currentStream = stream;
        cameraView.srcObject = stream;

        // 비디오 메타데이터가 로드되면 캔버스 크기 조정
        cameraView.onloadedmetadata = () => {
            hiddenCanvas.width = cameraView.videoWidth;
            hiddenCanvas.height = cameraView.videoHeight;
            console.log(`Canvas resized to: ${hiddenCanvas.width}x${hiddenCanvas.height}`);
        };

    } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 브라우저 설정을 확인하거나 다른 카메라를 선택해주세요.");
    }
}

// 카메라 전환 버튼 클릭 이벤트
switchCameraButton.addEventListener('click', () => {
    // facingMode 값 전환 (user <-> environment)
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    console.log(`Switching camera to: ${currentFacingMode}`);
    startCamera(); // 변경된 모드로 카메라 다시 시작
});

// 사진 저장 버튼 클릭 이벤트
captureButton.addEventListener('click', () => {
    if (!cameraView.srcObject || !hiddenCanvas.width) {
        alert("카메라가 준비되지 않았습니다.");
        return;
    }

    // 캔버스에 비디오 프레임과 오버레이 이미지 그리기
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.drawImage(overlayImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 캔버스 내용을 이미지 파일로 변환하여 다운로드
    const dataURL = hiddenCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = '산호초_복원_미션_인증샷.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert("사진이 갤러리에 저장되었습니다!");
});

// 페이지 로드 시 카메라 시작
startCamera();
