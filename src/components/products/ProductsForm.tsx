import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { IStateType } from "../../store/models/root.interfaces";
import { useSelector, useDispatch } from "react-redux";
import { IProduct, ProductModificationStatus } from "../../store/models/product.interface";
import TextInput, { OnChangeModel } from "../../common/elements/TextInput";
import { editProduct, clearProductPendingEdit, setModificationState } from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import NumberInput, { OnChangeNumberModel } from "../../common/elements/NumberInput";
import Checkbox, { OnChangeCheckboxModel } from "../../common/elements/Checkbox";
import SelectInput from "../../common/elements/Select";

const ProductForm: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const product: IProduct | null = useSelector((state: IStateType) => state.products.editProduct);
  const [formState, setFormState] = useState({
    name: { error: "", value: product ? product.name : "" },
    description: { error: "", value: product ? product.description : "" },
    amount: { error: "", value: product ? product.amount : 0 },
    price: { error: "", value: product ? product.price : 0 },
    hasExpiryDate: { error: "", value: product ? product.hasExpiryDate : false },
    category: { error: "", value: product ? product.category : "" }
  });

  function hasExpiryDateChanged(model: OnChangeCheckboxModel): void {
    setFormState({ ...formState, hasExpiryDate: { error: model.error, value: model.value } });
  }

  function onNameChange(model: OnChangeModel): void {
    setFormState({ ...formState, name: { error: model.error, value: model.value } });
  }

  function onDescriptionChange(model: OnChangeModel): void {
    setFormState({ ...formState, description: { error: model.error, value: model.value } });
  }

  function onAmountChange(model: OnChangeNumberModel): void {
    setFormState({ ...formState, amount: { error: model.error, value: model.value } });
  }

  function onPriceChange(model: OnChangeNumberModel): void {
    setFormState({ ...formState, price: { error: model.error, value: model.value } });
  }

  function onCategoryChange(model: OnChangeModel): void {
    setFormState({ ...formState, category: { error: model.error, value: model.value } });
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (getDisabledClass()) return;
    if (product) {
      dispatch(editProduct({
        ...product,
        name: formState.name.value,
        description: formState.description.value,
        price: formState.price.value,
        amount: formState.amount.value,
        hasExpiryDate: formState.hasExpiryDate.value,
        category: formState.category.value
      }));

      dispatch(addNotification("Product edited", `Product ${formState.name.value} edited by you`))
      dispatch(clearProductPendingEdit());
      dispatch(setModificationState(ProductModificationStatus.None))
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(ProductModificationStatus.None))
  }

  function getDisabledClass(): string {
    let isError = (formState.amount.error || formState.description.error
      || formState.name.error || formState.price.error || formState.hasExpiryDate.error
      || formState.category.error)

    return isError ? "disabled" : "";
  }

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Product Edit</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="input_email"
                    value={formState.name.value}
                    onChange={onNameChange}
                    required={true}
                    maxLength={20}
                    label="Name"
                    placeholder="Name" />
                </div>
                <div className="form-group col-md-6">
                  <SelectInput
                    id="input_category"
                    label="Category"
                    options={["Fruit", "Sweet", "Kitchen"]}
                    required={true}
                    onChange={onCategoryChange}
                    value={formState.category.value}
                  />
                </div>
              </div>
              <div className="form-group">
                <TextInput id="input_description"
                  value={formState.description.value}
                  onChange={onDescriptionChange}
                  required={false}
                  maxLength={100}
                  label="Description"
                  placeholder="Description" />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <NumberInput id="input_amount"
                    value={formState.amount.value}
                    onChange={onAmountChange}
                    max={1000}
                    min={0}
                    label="Amount" />
                </div>
                <div className="form-group col-md-6">
                  <NumberInput id="input_price"
                    value={formState.price.value}
                    onChange={onPriceChange}
                    max={1000}
                    min={0}
                    label="Price" />
                </div>
              </div>
              <div className="form-group">
                <Checkbox
                  id="checkbox_expiry"
                  value={formState.hasExpiryDate.value}
                  label="Has expiry date"
                  onChange={hasExpiryDateChanged}
                />
              </div>
              <button className="btn btn-danger" onClick={() => cancelForm()}>Cancel</button>
              <button type="submit" className={`btn btn-primary left-margin ${getDisabledClass()}`}>Save</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductForm;
