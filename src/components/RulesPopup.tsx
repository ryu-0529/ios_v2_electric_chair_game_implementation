import React from 'react';
import { XMarkIcon, BoltIcon } from '@heroicons/react/24/solid';

interface RulesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesPopup: React.FC<RulesPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-yellow-400/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-400 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <BoltIcon className="h-8 w-8 text-yellow-300 animate-pulse" />
            <h2 className="text-2xl font-bold text-yellow-300 animate-neon">電気椅子取りゲームのルール</h2>
            <BoltIcon className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                ゲームの目的
              </h3>
              <p className="text-yellow-100/80">
                プレイヤーは交互に椅子を選び、より多くのポイントを獲得することを目指します。
                ただし、相手が仕掛けた電気椅子を選ぶと、ショックを受けてしまいます。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                ゲームの進行
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-yellow-100/80 ml-4">
                <li>プレイヤーは交互に「電気椅子を仕掛ける」と「椅子を選ぶ」を行います</li>
                <li>椅子には1から12までの数字が書かれており、選んだ椅子の数字がポイントとなります</li>
                <li>一度選ばれた椅子は、以降選ぶことができなくなります</li>
                <li>電気椅子に当たると、そのプレイヤーの現在のポイントが0になり、ショックカウントが1増えます</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                勝利条件
              </h3>
              <ul className="list-disc list-inside space-y-2 text-yellow-100/80 ml-4">
                <li>40点以上を獲得した時点で即座に勝利</li>
                <li>相手が3回電気椅子に当たった場合、即座に勝利</li>
                <li>選べる椅子がなくなった時点で、より多くのポイントを持っているプレイヤーの勝利</li>
                <li>同点の場合は引き分け</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                戦略のヒント
              </h3>
              <ul className="list-disc list-inside space-y-2 text-yellow-100/80 ml-4">
                <li>高い数字の椅子は魅力的ですが、相手も狙っている可能性があります</li>
                <li>電気椅子の配置は、相手の行動パターンを予測して決めましょう</li>
                <li>残り椅子が少なくなってきたら、より慎重に選択する必要があります</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};