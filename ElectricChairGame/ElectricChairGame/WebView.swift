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
    
    private func setupWebView() {
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
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -GADAdSizeBanner.size.height)
        ])
        
        if let url = URL(string: "https://guileless-squirrel-dcef9e.netlify.app") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
    
    private func setupBannerAd() {
        bannerView = GADBannerView(adSize: GADAdSizeBanner)
        bannerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(bannerView)
        
        NSLayoutConstraint.activate([
            bannerView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            bannerView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            bannerView.widthAnchor.constraint(equalToConstant: GADAdSizeBanner.size.width),
            bannerView.heightAnchor.constraint(equalToConstant: GADAdSizeBanner.size.height)
        ])
        
        bannerView.adUnitID = AdConfiguration.bannerAdUnitID
        bannerView.rootViewController = self
    }
    
    private func loadInterstitialAd() {
        let request = GADRequest()
        GADInterstitialAd.load(withAdUnitID: AdConfiguration.interstitialAdUnitID,
                              request: request) { [weak self] ad, error in
            guard let self = self else { return }
            
            if let error = error {
                print("Failed to load interstitial ad with error: \(error.localizedDescription)")
                self.isInterstitialAdReady = false
                return
            }
            
            self.interstitialAd = ad
            self.interstitialAd?.fullScreenContentDelegate = self
            self.isInterstitialAdReady = true
        }
    }
    
    private func showInterstitialAd() {
        if let ad = interstitialAd, isInterstitialAdReady {
            ad.present(fromRootViewController: self)
        } else {
            print("Interstitial ad wasn't ready")
            loadInterstitialAd()
        }
    }
    
    private func requestIDFA() {
        ATTrackingManager.requestTrackingAuthorization { [weak self] status in
            DispatchQueue.main.async {
                self?.bannerView.load(GADRequest())
            }
        }
    }
}

// MARK: - WKScriptMessageHandler
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "homeButton", "replayButton":
            showInterstitialAd()
        default:
            break
        }
    }
}

// MARK: - WKNavigationDelegate
extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        loadingIndicator.startAnimating()
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingIndicator.stopAnimating()
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        loadingIndicator.stopAnimating()
        
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

// MARK: - GADFullScreenContentDelegate
extension ViewController: GADFullScreenContentDelegate {
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("Ad did dismiss full screen content")
        isInterstitialAdReady = false
        loadInterstitialAd()
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("Ad failed to present full screen content with error: \(error.localizedDescription)")
        isInterstitialAdReady = false
        loadInterstitialAd()
    }
}