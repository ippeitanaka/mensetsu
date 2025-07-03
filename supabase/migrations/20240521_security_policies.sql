-- テーブルのRLSを有効化
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;

-- 教員テーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "教員情報は誰でも閲覧可能" ON teachers
  FOR SELECT USING (true);

-- 認証済みユーザーのみ追加・更新・削除可能
CREATE POLICY "認証済みユーザーのみ教員追加可能" ON teachers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ教員更新可能" ON teachers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ教員削除可能" ON teachers
  FOR DELETE USING (auth.role() = 'authenticated');

-- 利用可能な日程テーブルのポリシー
-- 誰でも閲覧可能
CREATE POLICY "予約枠は誰でも閲覧可能" ON available_slots
  FOR SELECT USING (true);

-- 認証済みユーザーのみ追加・更新・削除可能
CREATE POLICY "認証済みユーザーのみ予約枠追加可能" ON available_slots
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ予約枠更新可能" ON available_slots
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーのみ予約枠削除可能" ON available_slots
  FOR DELETE USING (auth.role() = 'authenticated');
