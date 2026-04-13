# Hướng dẫn sử dụng chức năng Import CSV/Excel

## Tổng quan
Đã thêm chức năng import dữ liệu sản phẩm từ file CSV hoặc Excel vào admin panel.

## Những file đã thay đổi

### Backend (Server)
1. **server/package.json**: Thêm thư viện `xlsx` và `csv-parser`
2. **server/server.js**: 
   - Import thư viện: `xlsx`, `csv-parser`, `fs`
   - Thêm endpoint: `POST /admin/import`
3. **server/data/Product.js**: 
   - Thêm hàm `importProducts(products, options)`

### Frontend (Client)
1. **client/src/components/admin/ImportCSV.jsx**: Component mới cho trang import
2. **client/src/components/admin/AdminProductTable.jsx**: Thêm nút "📥 Import CSV/Excel"
3. **client/src/pages/AdminPage.jsx**: Thêm route `/admin/import`
4. **client/src/styles/styles.css**: Thêm CSS cho component import

## Cách sử dụng

### 1. Chuẩn bị file

#### Định dạng hỗ trợ:
- **CSV** (Comma Separated Values)
- **XLSX** (Excel 2007+)
- **XLS** (Excel 97-2003)

#### Cấu trúc file:

**Các trường BẮT BUỘC:**
- `id`: Mã sản phẩm (unique)
- `name`: Tên sản phẩm
- `price`: Giá (số, không âm)

**Các trường TÙY CHỌN:**
- `description`: Mô tả sản phẩm
- `stock`: Số lượng tồn kho (mặc định: 0)
- `warranty`: Thời gian bảo hành
- `tags`: Thẻ từ khóa, cách nhau bởi dấu phẩy hoặc chấm phẩy
- `images`: Đường dẫn ảnh (tùy chọn)

**Các trường thông số kỹ thuật (tự động đưa vào specifications):**
dpi, screenSize, driver, frequency, connectivity, battery, refreshRate, resolution, panelType, weight, dimensions, material, weightCapacity, adjustableHeight, armrests, wheels, foldable, color, compatibility, microphone, noiseCancellation, sensor, printTechnology, printSpeed, functions, paperSize, projectionTechnology, lumens, throwRatio, network

#### Ví dụ file CSV:

```csv
id,name,price,description,stock,tags,warranty,dpi
kb001,Ban Phim Co Gaming,1500000,Ban phim co switch Cherry,50,"gaming,keyboard",12 thang,
mouse001,Chuot Gaming Pro,800000,Chuot gaming DPI cao,100,"gaming,mouse",12 thang,16000
monitor001,Man Hinh Gaming 27,5000000,Man hinh 27 inch 165Hz,30,"gaming,monitor",24 thang,
```

### 2. Truy cập trang Import

1. Chạy server: `cd server && node server.js`
2. Chạy client: `cd client && npm start`
3. Đăng nhập vào admin: truy cập `/admin`
4. Nhấn nút **"📥 Import CSV/Excel"** ở góc phải trên

### 3. Import dữ liệu

1. **Chọn file**: Nhấn "Choose File" và chọn file CSV/Excel
2. **Tùy chọn ghi đè**:
   - ☑️ **Ghi đè nếu trùng ID**: Nếu sản phẩm có ID đã tồn tại, sẽ cập nhật với dữ liệu mới
   - ☐ **Không ghi đè**: Bỏ qua sản phẩm có ID trùng
3. **Nhấn "Import dữ liệu"**
4. **Xem kết quả**:
   - Tổng số dòng trong file
   - Số dòng import thành công
   - Số dòng bỏ qua (lỗi validation hoặc trùng ID)
   - Chi tiết các lỗi (tối đa 10 lỗi)

## Validation

### Validation cơ bản:
1. **Kiểm tra trường bắt buộc**: id, name, price
2. **Kiểm tra giá**: Phải là số, không âm
3. **Xử lý trùng ID**:
   - Nếu bật override: Cập nhật sản phẩm hiện có
   - Nếu tắt override: Bỏ qua dòng đó
4. **Chuẩn hóa dữ liệu**:
   - Trim khoảng trắng
   - Chuyển tags từ string sang array
   - Chuyển price sang số
   - Gom các trường thông số kỹ thuật vào `specifications`

## API Endpoint

### POST /admin/import

**Request:**
- Content-Type: multipart/form-data
- Field: `file` (CSV/XLSX/XLS)
- Query params:
  - `override` (boolean, default: true) - Có ghi đè khi trùng ID không

**Response thành công:**
```json
{
  "message": "Import hoàn tất",
  "totalRows": 10,
  "success": 8,
  "skipped": 2,
  "errors": [
    {
      "row": 3,
      "error": "Thiếu trường bắt buộc (id, name, price)",
      "data": {...}
    }
  ]
}
```

**Response lỗi:**
```json
{
  "error": "Định dạng file không được hỗ trợ. Chỉ chấp nhận CSV, XLSX, XLS"
}
```

## File mẫu để test

Đã tạo 2 file mẫu trong `server/data/`:
1. **sample-import.csv**: File CSV với 4 sản phẩm mẫu
2. **sample-import.xlsx**: File Excel với 3 sản phẩm mẫu

## Test thử

```bash
# 1. Chạy server
cd server
node server.js

# 2. Test import bằng curl (trong terminal khác)
curl -X POST http://localhost:5000/admin/import \
  -F "file=@server/data/sample-import.csv"

# Hoặc test với Excel
curl -X POST http://localhost:5000/admin/import \
  -F "file=@server/data/sample-import.xlsx"
```

## Lưu ý bảo mật

⚠️ **Cảnh báo**: Hiện tại endpoint `/admin/import` KHÔNG có authentication.
Bất kỳ ai cũng có thể gọi API này.

Để bảo mật, bạn nên:
1. Thêm middleware xác thực (JWT, session, API key)
2. Giới hạn kích thước file upload (hiện tại đang dùng config của image upload - 5MB)
3. Thêm rate limiting để tránh spam

## Xử lý sự cố

### Lỗi "Không thể kết nối đến server"
- Đảm bảo server đang chạy trên port 5000
- Kiểm tra `API_BASE` trong `client/src/api.js`

### Lỗi "File không có dữ liệu"
- Kiểm tra file có ít nhất 1 dòng dữ liệu (không tính header)
- Đảm bảo cột header có tên đúng (id, name, price)

### Lỗi "Thiếu trường bắt buộc"
- Mỗi dòng PHẢI có: id, name, price
- Kiểm tra file có bị ô trống không

### Import nhưng không có dữ liệu mới
- Kiểm tra MongoDB connection
- Xem log server để biết chi tiết lỗi
