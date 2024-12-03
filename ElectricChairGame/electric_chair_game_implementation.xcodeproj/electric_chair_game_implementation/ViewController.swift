import UIKit
import WebKit
import GoogleMobileAds
import AppTrackingTransparency

class ViewController: UIViewController {
    
    private var webView: WKWebView!
    private var bannerView: GADBannerView!
    private var interstitialAd: GADInterstitialAd?
    private var isInterstitialAdReady = false
    private let loadingIndicator = UIActivityIndicatorView(style: .large)
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        print("viewDidLoad開始")
        setupUI()
        setupWebView()
        setupBannerAd()
        loadInterstitialAd()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.requestIDFA()
        }
    }
    
    private func setupUI() {
        setupLoadingIndicator()
    }
    
    private func setupLoadingIndicator() {
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        loadingIndicator.hidesWhenStopped = true
        view.addSubview(loadingIndicator)
        
        NSLayoutConstraint.activate([
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    // MARK: - WebView Setup
    private func setupWebView() {
        print("WebView setup開始")
        let configuration = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        userContentController.add(self, name: "homeButton")
        userContentController.add(self, name: "replayButton")
        configuration.userContentController = userContentController
        
        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -50)
        ])
        
        if let url = URL(string: "https://subtle-faun-c9863a.netlify.app") {
            print("WebView URL: \(url)")
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    // MARK: - Banner Ad Setup
    private func setupBannerAd() {
        print("バナー広告のセットアップ開始")
        let frame = view.frame.inset(by: view.safeAreaInsets)
        let viewWidth = frame.size.width
        
        let adSize = GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(viewWidth)
        
        bannerView = GADBannerView(adSize: adSize)
        bannerView.delegate = self
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(bannerView)
        
        NSLayoutConstraint.activate([
            bannerView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            bannerView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            bannerView.widthAnchor.constraint(equalToConstant: viewWidth)
        ])
        
        bannerView.adUnitID = AdConfiguration.bannerAdUnitID
        print("バナー広告ID: \(AdConfiguration.bannerAdUnitID)")
        bannerView.rootViewController = self
        refreshBannerAd()
    }
    
    private func refreshBannerAd() {
        print("バナー広告のリフレッシュ開始")
        let request = GADRequest()
        bannerView.load(request)
    }
    
    // MARK: - Interstitial Ad Setup
    private func loadInterstitialAd() {
        print("インタースティシャル広告の読み込み開始: \(AdConfiguration.interstitialAdUnitID)")
        let request = GADRequest()
        GADInterstitialAd.load(withAdUnitID: AdConfiguration.interstitialAdUnitID,
                              request: request) { [weak self] ad, error in
            guard let self = self else {
                print("self が nil です")
                return
            }
            
            if let error = error {
                print("インタースティシャル広告の読み込みに失敗しました: \(error.localizedDescription)")
                self.isInterstitialAdReady = false
                DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
                    self.loadInterstitialAd()
                }
                return
            }
            
            print("インタースティシャル広告の読み込みが完了しました")
            self.interstitialAd = ad
            self.interstitialAd?.fullScreenContentDelegate = self
            self.isInterstitialAdReady = true
        }
    }
    
    private func showInterstitialAd() {
        print("showInterstitialAd が呼び出されました")
        guard let ad = interstitialAd, isInterstitialAdReady else {
            print("広告が準備できていないため、新しい広告をロードします")
            loadInterstitialAd()
            return
        }
        
        print("インタースティシャル広告を表示します")
        DispatchQueue.main.async {
            ad.present(fromRootViewController: self)
        }
    }
    
    // MARK: - IDFA Request
    private func requestIDFA() {
        print("IDFA リクエスト開始")
        ATTrackingManager.requestTrackingAuthorization { [weak self] status in
            DispatchQueue.main.async {
                switch status {
                case .authorized:
                    print("トラッキング許可が承認されました")
                    self?.bannerView.load(GADRequest())
                case .denied:
                    print("トラッキング許可が拒否されました")
                case .notDetermined:
                    print("トラッキング許可が未決定です")
                case .restricted:
                    print("トラッキング許可が制限されています")
                @unknown default:
                    print("不明なトラッキング許可状態です")
                }
            }
        }
    }
}

// MARK: - WKScriptMessageHandler
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        print("メッセージを受信: \(message.name)")
        
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            
            switch message.name {
            case "homeButton", "replayButton":
                print("ボタンクリックを検知: \(message.name)")
                self.showInterstitialAd()
            default:
                print("未知のメッセージ: \(message.name)")
            }
        }
    }
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingIndicator.stopAnimating()
        print("ページの読み込みが完了しました")
        
        // ボタンクリックを検知するJavaScriptを注入
        let script = """
            document.addEventListener('click', function(e) {
                const target = e.target;
                
                // ホームボタンの検知
                if (target.textContent.includes('ホームに戻る')) {
                    window.webkit.messageHandlers.homeButton.postMessage({});
                    console.log('ホームボタンがクリックされました');
                }
                
                // リプレイボタンの検知
                if (target.textContent.includes('もう一度プレイ')) {
                    window.webkit.messageHandlers.replayButton.postMessage({});
                    console.log('リプレイボタンがクリックされました');
                }
            });
        """
        
        webView.evaluateJavaScript(script) { _, error in
            if let error = error {
                print("JavaScriptの注入エラー: \(error)")
            } else {
                print("JavaScriptの注入が完了しました")
            }
        }
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        loadingIndicator.startAnimating()
        print("ページの読み込みを開始しました")
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        loadingIndicator.stopAnimating()
        print("ページの読み込みに失敗しました: \(error.localizedDescription)")
        
        let alert = UIAlertController(title: "エラー",
                                    message: "ページを読み込めませんでした。\nインターネット接続を確認してください。",
                                    preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "再試行", style: .default) { [weak self] _ in
            if let url = webView.url {
                self?.webView.load(URLRequest(url: url))
            }
        })
        alert.addAction(UIAlertAction(title: "キャンセル", style: .cancel))
        present(alert, animated: true)
    }
}

// MARK: - GADBannerViewDelegate
extension ViewController: GADBannerViewDelegate {
    func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
        print("バナー広告の読み込みが完了しました")
        bannerView.alpha = 0
        UIView.animate(withDuration: 0.3) {
            bannerView.alpha = 1
        }
    }
    
    func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) {
        print("バナー広告の読み込みに失敗しました: \(error.localizedDescription)")
        DispatchQueue.main.asyncAfter(deadline: .now() + 30.0) { [weak self] in
            self?.refreshBannerAd()
        }
    }
}

// MARK: - GADFullScreenContentDelegate
extension ViewController: GADFullScreenContentDelegate {
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("インタースティシャル広告が閉じられました")
        isInterstitialAdReady = false
        loadInterstitialAd()
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("インタースティシャル広告の表示に失敗しました: \(error.localizedDescription)")
        isInterstitialAdReady = false
        DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
            self.loadInterstitialAd()
        }
    }
    
    func adWillPresentFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("インタースティシャル広告が表示されようとしています")
    }
}
