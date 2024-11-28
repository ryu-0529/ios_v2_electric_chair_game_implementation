import SwiftUI
import WebKit
import Combine

struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var error: Error?
    @ObservedObject var adManager = AdMobManager.shared
    
    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        var parent: WebView
        var webView: WKWebView?
        
        init(_ parent: WebView) {
            self.parent = parent
            super.init()
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.error = nil
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
            
            // JavaScriptを注入してボタンクリックを監視
            let script = """
                document.addEventListener('click', function(e) {
                    if (e.target.matches('button')) {
                        const buttonText = e.target.textContent.trim();
                        if (buttonText === 'ホームに戻る' || buttonText === 'もう一度プレイ') {
                            window.webkit.messageHandlers.buttonClicked.postMessage(buttonText);
                        }
                    }
                });
            """
            webView.evaluateJavaScript(script, completionHandler: nil)
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.error = error
        }
        
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "buttonClicked" {
                if parent.adManager.isAdLoaded {
                    parent.adManager.showAd()
                }
            }
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        // JavaScript messageHandlerの設定
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "buttonClicked")
        configuration.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        context.coordinator.webView = webView
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url, cachePolicy: .returnCacheDataElseLoad)
        webView.load(request)
    }
}