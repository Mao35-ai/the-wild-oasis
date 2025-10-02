import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error("Cabins could not be loaded");
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  console.log(newCabin);

  // 【核心修复 1/2】: 正确处理图片路径和上传
  // 检查 `newCabin.image` 是不是一个已有的URL (string类型)，来判断是否需要上传新图片
  const hasImagePath = typeof newCabin.image === "string";

  // 如果是新图片，创建一个独一无二的文件名。否则文件名为空。
  const imageName = hasImagePath
    ? null
    : `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  // 如果是已有图片，直接使用旧路径。如果是新图片，构建新路径。
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // --- 数据库操作 ---
  let query = supabase.from("cabins");
  let dbOperation;

  // A. 创建操作 (CREATE)
  if (!id) {
    dbOperation = query.insert([{ ...newCabin, image: imagePath }]);
  }

  // B. 编辑操作 (EDIT)
  if (id) {
    dbOperation = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  const { data, error } = await dbOperation.select().single();

  if (error) {
    console.error(error);
    throw new Error("小屋数据无法保存");
  }

  // --- 图片上传 ---
  // 如果是已有图片，我们直接跳过上传，返回数据
  if (hasImagePath) return data;

  // 如果是新图片，现在才执行上传操作
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 【核心修复 2/2】: 处理上传失败的情况
  // 如果图片上传失败，我们需要把刚刚在数据库里创建的记录删掉，避免数据不一致
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("图片上传失败，小屋创建已被回滚");
  }

  return data;
}
