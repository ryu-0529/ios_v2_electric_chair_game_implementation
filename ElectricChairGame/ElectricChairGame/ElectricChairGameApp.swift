import SwiftUI
import GoogleMobileAds

@main
struct ElectricChairGameApp: App {
    init() {
        // AdMobの初期化
        GADMobileAds.sharedInstance().start(completionHandler: nil)
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}