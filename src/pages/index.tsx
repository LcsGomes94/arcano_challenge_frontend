import { ChangeEvent, useEffect, useRef, useState } from "react";

type CartHistory = {
  userName: string;
  userEmail: string;
  cartHistory: {
    cartId: number;
    products: {
      name: string;
      quantity: number;
    }[];
  }[];
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [cartHistory, setCartHistory] = useState<CartHistory>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const getCartHistory = setTimeout(async () => {
      if (inputValue.length > 0) {
        setIsLoading(true);
        try {
          const cartHistoryRes = await fetch(
            `http://localhost:3030/user/cart-history/${inputValue}`,
            { signal: abortController.signal }
          );

          if (!cartHistoryRes.ok) {
            throw new Error(
              `${cartHistoryRes.status} - ${cartHistoryRes.statusText}`
            );
          }

          const cartHistoryData = await cartHistoryRes.json();
          setError(false);
          setCartHistory(cartHistoryData);
        } catch (e: any) {
          setError(true);
          setErrorMessage(e.message);
        }
        setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(getCartHistory);
      abortController.abort();
    };
  }, [inputValue]);

  function handleInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <main className={`w-full h-screen flex flex-col items-center mt-20`}>
      <div className={`mb-10`}>
        <input
          ref={inputElement}
          type="number"
          className={`outline-none w-28 py-0.5 text-center bg-inherit font-semibold placeholder:opacity-60 border-2 border-cyan-500 rounded-lg
          `}
          placeholder={`user id`}
          onChange={handleInputValue}
          value={inputValue}
        />
      </div>
      {isLoading && <h1 className={`font-bold text-teal-300`}>Loading...</h1>}
      {!isLoading && error && (
        <h1 className={`font-bold text-red-500`}>{errorMessage}</h1>
      )}
      {!isLoading && !error && cartHistory && (
        <div>
          <div>
            <span className={`font-bold text-teal-300`}>{"User: "}</span>
            <span className={`capitalize`}>{cartHistory.userName}</span>
          </div>
          <div>
            <span className={`font-bold text-teal-300`}>{"Email: "}</span>
            <span>{cartHistory.userEmail}</span>
          </div>
          {cartHistory.cartHistory.map((cart) => (
            <div key={cart.cartId} className={`my-4`}>
              <div>
                <span className={`font-bold text-cyan-400`}>{"Cart Id: "}</span>
                <span>{cart.cartId}</span>
              </div>
              {cart.products.map((product) => (
                <div key={product.name}>
                  <span
                    className={`font-bold text-teal-300`}
                  >{`${product.quantity}x - `}</span>
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          ))}
          {!cartHistory.cartHistory.length && (
            <h2 className={`font-bold text-yellow-500 my-4`}>
              No cart history found!
            </h2>
          )}
        </div>
      )}
    </main>
  );
}
