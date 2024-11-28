import UIKit
import WebKit
import GoogleMobileAds
import AppTrackingTransparency

class ViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler, GADFullScreenContentDelegate {
    
    private var webView: WKWebView!
    private var bannerView: GADBannerView!
    private var interstitialAd: GADInterstitialAd?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        setupBannerAd()
        loadInterstitialAd()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.requestIDFA()
        }
    }
    
    private func requestIDFA() {
        ATTrackingManager.requestTrackingAuthorization { status in
            DispatchQueue.main.async {
                switch status {
                case .authorized:
                    print("Tracking authorization authorized")
                    self.bannerView.load(GADRequest())
                case .denied:
                    print("Tracking authorization denied")
                case .notDetermined:
                    print("Tracking authorization not determined")
                case .restricted:
                    print("Tracking authorization restricted")
                @unknown default:
                    print("Tracking authorization unknown")
                }
            }
        }
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
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -50)
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
            bannerView.widthAnchor.constraint(equalToConstant: 320),
            bannerView.heightAnchor.constraint(equalToConstant: 50)
        ])
        
        bannerView.adUnitID = "ca-app-pub-1982702464173576/7465302958"
        bannerView.rootViewController = self
        bannerView.load(GADRequest())
    }
    
    private func loadInterstitialAd() {
        let request = GADRequest()
        GADInterstitialAd.load(withAdUnitID: "ca-app-pub-1982702464173576/4835270189",
                              request: request) { [weak self] ad, error in
            if let error = error {
                print("Failed to load interstitial ad with error: \(error.localizedDescription)")
                return
            }
            self?.interstitialAd = ad
            self?.interstitialAd?.fullScreenContentDelegate = self
        }
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name {
        case "homeButton", "replayButton":
            showInterstitialAd()
        default:
            break
        }
    }
    
    private func showInterstitialAd() {
        if let ad = interstitialAd {
            ad.present(fromRootViewController: self)
        } else {
            print("Interstitial ad wasn't ready")
            loadInterstitialAd()
        }
    }
}

// MARK: - WKNavigationDelegate
extension ViewController {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        // ローディングインジケータの表示など
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // ローディングインジケータの非表示など
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        let alert = UIAlertController(title: "エラー",
                                    message: "ページを読み込めませんでした",
                                    preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - GADFullScreenContentDelegate
extension ViewController {
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("Ad did dismiss full screen content")
        loadInterstitialAd()
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("Ad failed to present full screen content with error: \(error.localizedDescription)")
    }
}
