CREATE TRIGGER on_auth_user_created_member AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_member_on_new_user();


