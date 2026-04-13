import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../api";

function ImportCSV() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [override, setOverride] = useState(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();
      const allowed = ["csv", "xlsx", "xls"];
      if (!allowed.includes(ext)) {
        setError("Chỉ chấp nhận file CSV, XLSX hoặc XLS");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn file để import");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${API_BASE}/admin/import?override=${override}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra khi import");
        return;
      }

      setResult(data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-csv">
      <h2 className="import-title">Import dữ liệu từ CSV/Excel</h2>

      <form onSubmit={handleImport} className="import-form">
        <div className="import-section">
          <label className="import-label">
            Chọn file (CSV, XLSX, XLS):
          </label>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="import-file-input"
            required
          />
          {file && (
            <p className="import-file-name">
              File đã chọn: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <div className="import-option">
          <label>
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
            />
            Ghi đè nếu trùng mã sản phẩm (ID)
          </label>
        </div>

        <div className="import-actions">
          <button
            type="submit"
            disabled={loading || !file}
            className="admin-btn admin-btn-primary"
          >
            {loading ? "Đang import..." : "Import dữ liệu"}
          </button>
          <Link to="/admin" className="admin-btn admin-btn-secondary">
            Quay lại
          </Link>
        </div>
      </form>

      {error && (
        <div className="import-error">
          <h3>Lỗi:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="import-result">
          <h3>Kết quả import:</h3>
          <div className="import-stats">
            <div className="import-stat">
              <span className="import-stat-label">Tổng số dòng:</span>
              <span className="import-stat-value">
                {result.totalRows || 0}
              </span>
            </div>
            <div className="import-stat import-stat-success">
              <span className="import-stat-label">Thành công:</span>
              <span className="import-stat-value">{result.success}</span>
            </div>
            <div className="import-stat import-stat-skipped">
              <span className="import-stat-label">Bỏ qua:</span>
              <span className="import-stat-value">{result.skipped}</span>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="import-errors">
              <h4>Có {result.errors.length} lỗi (hiển thị tối đa 10):</h4>
              <ul>
                {result.errors.map((err, idx) => (
                  <li key={idx}>
                    <strong>Dòng {err.row}:</strong> {err.error}
                    {err.data && err.data.id && (
                      <span> (ID: {err.data.id})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="import-result-actions">
            <Link to="/admin" className="admin-btn admin-btn-primary">
              Xem danh sách sản phẩm
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
              }}
              className="admin-btn admin-btn-secondary"
            >
              Import file khác
            </button>
          </div>
        </div>
      )}

      <div className="import-guide">
        <h3>Hướng dẫn:</h3>
        <ul>
          <li>File import phải có định dạng CSV, XLSX hoặc XLS</li>
          <li>
            Các trường <strong>bắt buộc</strong>: <code>id</code>,{" "}
            <code>name</code>, <code>price</code>
          </li>
          <li>
            Các trường tùy chọn: <code>description</code>,{" "}
            <code>stock</code>, <code>warranty</code>, <code>tags</code>,{" "}
            <code>images</code>
          </li>
          <li>
            Tags cách nhau bởi dấu phẩy hoặc chấm phẩy (VD:{" "}
            <code>gaming,keyboard,mechanical</code>)
          </li>
          <li>
            Nếu chọn "Ghi đè nếu trùng ID", sản phẩm có cùng mã sẽ được cập
            nhật với dữ liệu mới
          </li>
          <li>
            Các cột thông số kỹ thuật (dpi, screenSize, driver, v.v.) sẽ tự
            động đưa vào trường specifications
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ImportCSV;
