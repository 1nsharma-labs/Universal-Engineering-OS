#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn system_status(name: &str) -> String {
    format!("Universal Dev Hub Rust Core active for: {}", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![system_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
