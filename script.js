const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const switchCameraButton = document.getElementById('switch-camera-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');
const cameraContainer = document.querySelector('.camera-container');

let currentStream;
let currentFacingMode = 'user'; // 시작을 전면 카메라('user')로 설정

async function startCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode }
        });
        currentStream = stream;
        cameraView.srcObject = stream;
    } catch (err) {
        console.error("카메라 접근 실패:", err);
        alert("카메라를 사용할 수 없습니다.");
    }
}

switchCameraButton.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    // CSS transform을 직접 제어하여 화면에 보이는 카메라 영상만 반전시킴
    cameraView.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
    startCamera();
});

captureButton.addEventListener('click', () => {
    if (!currentStream) {
        alert("카메라가 준비되지 않았습니다.");
        return;
    }

    // 화면에 표시되는 컨테이너의 실제 크기를 캔버스 크기로 설정
    const width = cameraContainer.clientWidth;
    const height = cameraContainer.clientHeight;
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;

    // 1. 카메라 영상 그리기 (object-fit: cover 로직 구현)
    const videoRatio = cameraView.videoWidth / cameraView.videoHeight;
    const canvasRatio = width / height;
    let sx = 0, sy = 0, sWidth = cameraView.videoWidth, sHeight = cameraView.videoHeight;

    if (videoRatio > canvasRatio) {
        sWidth = cameraView.videoHeight * canvasRatio;
        sx = (cameraView.videoWidth - sWidth) / 2;
    } else {
        sHeight = cameraView.videoWidth / canvasRatio;
        sy = (cameraView.videoHeight - sHeight) / 2;
    }
    
    ctx.save();
    // 좌우 반전 상태를 캔버스에 동일하게 적용
    if (currentFacingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(cameraView, sx, sy, sWidth, sHeight, 0, 0, width, height);
    ctx.restore();

    // 2. PNG 프레임 이미지를 위에 그리기
    ctx.drawImage(overlayImage, 0, 0, width, height);
    
    // 최종 이미지 다운로드
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
