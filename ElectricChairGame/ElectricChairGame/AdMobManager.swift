import GoogleMobileAds
import SwiftUI

class AdMobManager: NSObject, ObservableObject, GADFullScreenContentDelegate {
    @Published var isAdLoaded = false
    private var interstitial: GADInterstitialAd?
    
    static let shared = AdMobManager()
    
    override init() {
        super.init()
        loadInterstitial()
    }
    
    func loadInterstitial() {
        let request = GADRequest()
        // テスト用広告ID。本番環境では実際の広告IDに置き換えてください。
        GADInterstitialAd.load(
            withAdUnitID: "ca-app-pub-3940256099942544/4411468910",
            request: request
        ) { [weak self] ad, error in
            guard let self = self else { return }
            
            if let error = error {
                print("Failed to load interstitial ad with error: \(error.localizedDescription)")
                return
            }
            
            self.interstitial = ad
            self.interstitial?.fullScreenContentDelegate = self
            self.isAdLoaded = true
        }
    }
    
    func showAd() {
        if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
            if let ad = interstitial {
                ad.present(fromRootViewController: rootViewController)
            } else {
                print("Ad wasn't ready")
                loadInterstitial()
            }
        }
    }
    
    // GADFullScreenContentDelegate methods
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("Ad dismissed")
        loadInterstitial()
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("Ad failed to present with error: \(error.localizedDescription)")
        loadInterstitial()
    }
}