import SwiftUI

struct ContentView: View {
    @StateObject private var networkMonitor = NetworkMonitor()
    @State private var isLoading = false
    @State private var error: Error?
    @State private var showError = false
    
    var body: some View {
        ZStack {
            WebView(
                url: URL(string: "https://guileless-squirrel-dcef9e.netlify.app")!,
                isLoading: $isLoading,
                error: $error
            )
            .edgesIgnoringSafeArea(.all)
            
            if !networkMonitor.isConnected {
                OfflineView()
            }
            
            if isLoading {
                LoadingView()
            }
            
            VStack {
                Spacer()
                BannerAdView()
                    .frame(height: 50)
            }
        }
        .alert("エラー", isPresented: $showError) {
            Button("OK") {
                showError = false
            }
        } message: {
            Text(error?.localizedDescription ?? "予期せぬエラーが発生しました")
        }
        .onChange(of: error) { newError in
            showError = newError != nil
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}