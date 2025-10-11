const cameraView = document.getElementById('camera-view');
const overlayImage = document.querySelector('.overlay-image');
const captureButton = document.getElementById('capture-button');
const shareButton = document.getElementById('share-button');
const hiddenCanvas = document.getElementById('hidden-canvas');
const ctx = hiddenCanvas.getContext('2d');

let currentStream; // 카메라 스트림을 저장할 변수

// 카메라 접근 및 스트림 설정
async function startCamera() {
    try {
        // 기존 스트림이 있으면 중지 (카메라 전환 등을 위해)
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment' // 후면 카메라
            }
        });
        currentStream = stream; // 현재 스트림 저장
        cameraView.srcObject = stream;

        // 비디오 메타데이터가 로드되면 캔버스 크기 조정 (중요!)
        cameraView.onloadedmetadata = () => {
            hiddenCanvas.width = cameraView.videoWidth;
            hiddenCanvas.height = cameraView.videoHeight;
            console.log("Canvas resized to:", hiddenCanvas.width, hiddenCanvas.height);
        };

    } catch (err) {
        console.error("카메라 접근에 실패했습니다:", err);
        alert("카메라를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.");
    }
}

// 사진 촬영 및 저장 함수
captureButton.addEventListener('click', () => {
    if (!cameraView.srcObject) {
        alert("카메라가 활성화되지 않았습니다.");
        return;
    }

    // 캔버스에 비디오 프레임 그리기
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 오버레이 이미지 그리기 (비디오 크기에 맞춰)
    ctx.drawImage(overlayImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 캔버스 내용을 이미지 파일로 변환
    const dataURL = hiddenCanvas.toDataURL('image/png'); // PNG 형식

    // 이미지 다운로드를 위한 임시 링크 생성
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = '산호초_복원_미션_인증샷.png'; // 다운로드될 파일 이름
    document.body.appendChild(a);
    a.click(); // 링크 클릭하여 다운로드 시작
    document.body.removeChild(a); // 사용 후 링크 제거
    alert("사진이 갤러리에 저장되었습니다!");
});

// SNS 공유 함수
shareButton.addEventListener('click', async () => {
    if (!cameraView.srcObject) {
        alert("카메라가 활성화되지 않았습니다.");
        return;
    }

    // 캔버스에 비디오 프레임 그리기
    ctx.drawImage(cameraView, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    // 오버레이 이미지 그리기
    ctx.drawImage(overlayImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // 캔버스 내용을 Blob으로 변환 (공유 API용)
    hiddenCanvas.toBlob(async (blob) => {
        if (blob) {
            const filesArray = [
                new File([blob], '산호초_복원_인증샷.png', { type: 'image/png' })
            ];

            // Web Share API 지원 여부 확인
            if (navigator.share && navigator.canShare && navigator.canShare({ files: filesArray })) {
                try {
                    await navigator.share({
                        files: filesArray,
                        title: '산호초 복원 미션 인증샷!',
                        text: '#산호초복원 #해양환경보호 #지구지킴이',
                        url: window.location.href // 현재 웹앱 주소를 공유
                    });
                    console.log('공유 성공');
                } catch (error) {
                    console.error('공유 실패:', error);
                    alert('사진 공유에 실패했습니다.');
                }
            } else {
                // Web Share API를 지원하지 않는 경우 (예: PC 브라우저)
                alert("이 기기에서는 사진을 직접 공유할 수 없습니다. '사진 저장' 버튼을 이용해 수동으로 공유해주세요.");
                console.log('Web Share API Not Supported');
            }
        } else {
            alert("이미지 생성에 실패했습니다.");
        }
    }, 'image/png');
});


// 페이지 로드 시 카메라 시작
startCamera();
