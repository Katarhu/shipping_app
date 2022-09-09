import {RootState, AppDispatch} from "../Redux/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;