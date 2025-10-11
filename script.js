const cameraView = document.getElementById('camera-view');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }
        });
        cameraView.srcObject = stream;
    } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
}

startCamera();
