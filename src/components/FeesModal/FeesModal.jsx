import { useEffect, useState } from "react";
import { Input } from "../Input/Input";
import { motion } from "framer-motion";
import "./FeesModal.css";
import { Trash2 } from "lucide-react";
import useSubmit from "../../hooks/useSubmit";

export default function FeesModal({ data, close, refreshFunction }) {
  const [feeCategories, setFeeCategories] = useState([]);
  const [registrationFee, setRegistrationFee] = useState({
    description: "",
    feecategories: [],
  });
  const [loading, setLoading] = useState(false);
  const { submit } = useSubmit();

  useEffect(() => {
    if (data) {
      const { feecategories, ...fee } = data;
      setFeeCategories(feecategories || []);
      setRegistrationFee(fee);
    }
  }, [data]);

  const handleFeeChange = (index, field, value) => {
    const updatedFees = [...feeCategories];
    updatedFees[index] = { ...updatedFees[index], [field]: value };
    setFeeCategories(updatedFees);
  };

  const handleAddCategory = () => {
    setFeeCategories([
      ...feeCategories,
      {
        type: "",
        ieee_member: "",
        non_ieee_member: "",
        virtual_attendance: "",
      },
    ]);
  };

  const handleRemoveCategory = (index) => {
    const updatedFees = [...feeCategories];
    updatedFees.splice(index, 1);
    setFeeCategories(updatedFees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedFee = {
      ...registrationFee,
      description: registrationFee.description.toLowerCase(),
      feecategories: feeCategories,
    };

    const id = registrationFee.id;

    const response = await submit({
      url: `/Registration-fees/${id ? `update/${id}` : "create"}`,
      method: id ? "PUT" : "POST",
      data: updatedFee,
    });

    setLoading(false);

    if (!response) return;

    refreshFunction
      ? response?.newItem
        ? refreshFunction(response.newItem)
        : refreshFunction(updatedFee)
      : null;
    response && close();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="committee-form"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <h2>Update registration fee</h2>
          <Input
            value={registrationFee.description}
            onChange={(e) =>
              setRegistrationFee({
                ...registrationFee,
                description: e.target.value,
              })
            }
            name="description"
            placeholder="Description/country"
            label="Description/country"
          />
          <div className="fee-categories-container">
            {feeCategories.map((feeCategory, index) => (
              <div className="fee-category" key={index}>
                <Input
                  value={feeCategory.type}
                  onChange={(e) =>
                    handleFeeChange(index, "type", e.target.value)
                  }
                  name={`type-${index}`}
                  placeholder="Type"
                  label="Type"
                />
                <Input
                  value={feeCategory.ieee_member}
                  onChange={(e) =>
                    handleFeeChange(index, "ieee_member", e.target.value)
                  }
                  name={`ieee_member-${index}`}
                  placeholder="IEEE member"
                  label="IEEE member"
                />
                <Input
                  value={feeCategory.non_ieee_member}
                  onChange={(e) =>
                    handleFeeChange(index, "non_ieee_member", e.target.value)
                  }
                  name={`non_ieee_member-${index}`}
                  placeholder="Non IEEE member"
                  label="Non IEEE member"
                />
                <Input
                  value={feeCategory.virtual_attendance}
                  onChange={(e) =>
                    handleFeeChange(index, "virtual_attendance", e.target.value)
                  }
                  name={`virtual_attendance-${index}`}
                  placeholder="Virtual attendance"
                  label="Virtual attendance"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
          <div className="add-button-wrapper">
            <button
              type="button"
              onClick={handleAddCategory}
              className="add-button"
            >
              + Ajouter une catégorie
            </button>
          </div>
          <div className="button-container">
            <button className="button small" type="submit">
              {loading
                ? "Submitting..."
                : registrationFee.id
                ? "Update"
                : "Create"}
            </button>
            <button className="cancel-button" type="button" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
